package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// CreateTransaction starts a new top-up order and retrieves a payment URL.
func CreateTransaction(userID string, req dto.CreateTransactionRequest) (*dto.TransactionDetailResponse, error) {
	// 1. Verify Product
	var product models.Product
	if err := database.DB.Preload("Game").Where("id = ? AND active = ?", req.ProductID, true).First(&product).Error; err != nil {
		return nil, errors.New("product not found or inactive")
	}

	// 2. Generate unique internal IDs (Plain UUID)
	internalTxID := uuid.NewString()

	// Mayar requires unique Order IDs per attempt. Shortened to stay well under 50 char limit.
	mayarOrderID := fmt.Sprintf("MID-%s-%d", internalTxID[:8], time.Now().Unix())

	// 3. Calculate Total Amount with Service Fees (Matching Frontend Logic)
	// Bank Transfer: Rp 4.000, GoPay/E-wallet: 2%, QRIS: 0.7%
	finalAmount := product.Price
	method := req.PaymentMethod

	switch method {
	case "BNI", "BRI", "MANDIRI", "PERMATA":
		finalAmount += 4000

	case "GOPAY", "DANA", "OVO", "SHOPEEPAY":
		// 2% fee
		finalAmount = finalAmount * 102 / 100

	case "QRIS":
		// 0.7% fee
		finalAmount = finalAmount * 1007 / 1000
	}



	// 5. Call Mayar Payment Gateway
	paymentURL, err := CreatePaymentRequest(mayarOrderID, finalAmount, req.Email, "Order "+product.Title)
	if err != nil {
		utils.Error("Mayar creation failed", err, "order_id", mayarOrderID)
		return nil, errors.New("failed to initialize payment gateway")
	}
	snapToken := "" // Not used for Mayar
	qrString := ""  // Using standard URL for QRIS as well

	// 4. Save to DB — status PENDING, expires in 15 mins
	tx := models.Transaction{
		ID:              internalTxID,
		UserID:          userID,
		ProductID:       product.ID,
		GameName:        product.Game.Name,
		ProductTitle:    product.Title,
		Amount:          finalAmount,
		PaymentMethod:   req.PaymentMethod,
		MayarOrderID: mayarOrderID,
		PaymentURL:      paymentURL,
		PaymentToken:    snapToken,
		QRString:        qrString,
		GameUID:         req.GameUID,
		Server:          req.Server,
		Email:           req.Email,
		Status:          "PENDING",
		ExpiredAt:       time.Now().Add(15 * time.Minute),
	}

	if err := database.DB.Create(&tx).Error; err != nil {
		utils.Error("Failed to save transaction", err, "tx_id", internalTxID)
		return nil, errors.New("database error")
	}

	utils.Info("Transaction created successfully", "tx_id", tx.ID, "amount", tx.Amount)

	res := mapTransactionToDetailResponse(tx)
	return &res, nil
}

// GetUserTransactions returns a list of transactions for a specific user.
func GetUserTransactions(userID string) ([]dto.TransactionListItemResponse, error) {
	var txs []models.Transaction
	if err := database.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&txs).Error; err != nil {
		return nil, err
	}

	var res []dto.TransactionListItemResponse
	for _, t := range txs {
		res = append(res, dto.TransactionListItemResponse{
			ID:            t.ID,
			GameName:      t.GameName,
			ProductTitle:  t.ProductTitle,
			Amount:        t.Amount,
			PaymentMethod: t.PaymentMethod,
			Status:        t.Status,
			CreatedAt:     t.CreatedAt,
		})
	}
	return res, nil
}

// GetTransactionDetail retrieves a specific transaction and performs a lazy expiry check.
func GetTransactionDetail(txID, userID string, isAdmin bool) (*dto.TransactionDetailResponse, error) {
	var tx models.Transaction
	query := database.DB.Where("id = ?", txID)

	if !isAdmin {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.First(&tx).Error; err != nil {
		return nil, errors.New("transaction not found")
	}

	// Lazy Expiry Check
	if tx.Status == "PENDING" && time.Now().After(tx.ExpiredAt) {
		tx.Status = "FAILED"
		tx.FailureReason = "Payment window expired (15 minutes)"
		database.DB.Save(&tx)
		utils.Info("Transaction lazy-expired on read", "tx_id", tx.ID)
	}

	res := mapTransactionToDetailResponse(tx)
	return &res, nil
}

// GetAllTransactions Admin only list.
func GetAllTransactions() ([]dto.AdminTransactionResponse, error) {
	var txs []models.Transaction
	if err := database.DB.Order("created_at desc").Find(&txs).Error; err != nil {
		return nil, err
	}

	var res []dto.AdminTransactionResponse
	for _, t := range txs {
		res = append(res, dto.AdminTransactionResponse{
			ID:              t.ID,
			UserID:          t.UserID,
			GameName:        t.GameName,
			ProductTitle:    t.ProductTitle,
			Amount:          t.Amount,
			PaymentMethod:   t.PaymentMethod,
			MayarOrderID: t.MayarOrderID,
			GameUID:         t.GameUID,
			Server:          t.Server,
			Email:           t.Email,
			Status:          t.Status,
			FailureReason:   t.FailureReason,
			ExpiredAt:       t.ExpiredAt,
			CreatedAt:       t.CreatedAt,
			UpdatedAt:       t.UpdatedAt,
		})
	}
	return res, nil
}

// UpdateTransactionStatus manual override by Admin.
func UpdateTransactionStatus(txID string, req dto.UpdateTransactionStatusRequest) (*dto.TransactionDetailResponse, error) {
	var tx models.Transaction
	if err := database.DB.Where("id = ?", txID).First(&tx).Error; err != nil {
		return nil, errors.New("transaction not found")
	}

	tx.Status = req.Status
	if req.FailureReason != "" {
		tx.FailureReason = req.FailureReason
	}

	if err := database.DB.Save(&tx).Error; err != nil {
		return nil, err
	}

	utils.Info("Admin manually updated transaction status", "tx_id", tx.ID, "status", tx.Status)

	res := mapTransactionToDetailResponse(tx)
	return &res, nil
}

// UpdateFromWebhook handles automated status updates arriving from Mayar.
func UpdateFromWebhook(mayarOrderID, status, failureReason string) error {
	var tx models.Transaction
	if err := database.DB.Where("mayar_order_id = ?", mayarOrderID).First(&tx).Error; err != nil {
		return errors.New("transaction not found for webhook order id")
	}

	// Prevent reversing completed transactions
	if tx.Status == "SUCCESS" {
		utils.Info("Webhook ignored: transaction already SUCCESS", "tx_id", tx.ID)
		return nil
	}

	tx.Status = status
	if failureReason != "" {
		tx.FailureReason = failureReason
	}

	if err := database.DB.Save(&tx).Error; err != nil {
		return err
	}

	if status == "SUCCESS" {
		// 1. Deliver goods (API Call)
		err := Deliver(tx)
		if err != nil {
			utils.Error("Delivery failed post-payment", err, "tx_id", tx.ID)
			// Note: We leave status as SUCCESS because payment cleared.
			// Reconciling failed deliveries is a separate manual/admin flow.
		}

		// 2. Send Email Receipt
		SendReceipt(tx)
	}

	return nil
}

func mapTransactionToDetailResponse(tx models.Transaction) dto.TransactionDetailResponse {
	return dto.TransactionDetailResponse{
		ID:              tx.ID,
		GameName:        tx.GameName,
		ProductTitle:    tx.ProductTitle,
		Amount:          tx.Amount,
		PaymentMethod:   tx.PaymentMethod,
		PaymentURL:      tx.PaymentURL,
		PaymentToken:    tx.PaymentToken,
		QRString:        tx.QRString,
		GameUID:         tx.GameUID,
		Server:          tx.Server,
		Email:           tx.Email,
		Status:          tx.Status,
		FailureReason:   tx.FailureReason,
		MayarOrderID: tx.MayarOrderID,
		ExpiredAt:       tx.ExpiredAt,
		CreatedAt:       tx.CreatedAt,
	}
}
