package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// MayarNotification payload shape
type MayarNotification struct {
	TransactionTime   string `json:"transaction_time"`
	TransactionStatus string `json:"transaction_status"`
	TransactionID     string `json:"transaction_id"`
	StatusMessage     string `json:"status_message"`
	StatusCode        string `json:"status_code"`
	SignatureKey      string `json:"signature_key"`
	PaymentType       string `json:"payment_type"`
	OrderID           string `json:"order_id"`
	MerchantID        string `json:"merchant_id"`
	GrossAmount       string `json:"gross_amount"`
	FraudStatus       string `json:"fraud_status"`
	Currency          string `json:"currency"`
}

// WebhookMayar handles asynchronous notifications from Mayar Core API.
func WebhookMayar(c *fiber.Ctx) error {
	var n MayarNotification
	if err := json.Unmarshal(c.Body(), &n); err != nil {
		utils.Error("Failed parsing webhook body", err)
		return c.SendStatus(fiber.StatusBadRequest)
	}

	utils.Info("Mayar Webhook hit", "order_id", n.OrderID, "status", n.TransactionStatus)

	// 1. Verify Signature
	if !services.VerifySignature(n.OrderID, n.StatusCode, n.GrossAmount, n.SignatureKey) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// 2. Map Mayar Status to Internal Status
	var status string
	var failure string

	switch n.TransactionStatus {
	case "settlement", "capture":
		if n.FraudStatus == "challenge" {
			status = "CHALLENGE"
		} else {
			status = "SUCCESS"
		}
	case "pending":
		status = "PENDING"
	case "deny", "cancel", "expire", "failure":
		status = "FAILED"
		failure = n.StatusMessage
	}

	// 3. Update Transaction and trigger side-effects (delivery/email)
	if status != "" {
		if err := services.UpdateFromWebhook(n.OrderID, status, failure); err != nil {
			utils.Error("Webhook DB update failed", err, "order_id", n.OrderID)
			// Return 500 so Mayar retries if it was an intermittent DB failure
			return c.SendStatus(fiber.StatusInternalServerError)
		}
	}

	// Mayar expects HTTP 200 OK immediately
	return c.SendStatus(fiber.StatusOK)
}
