package dto

import "time"

// CreateTransactionRequest - used by user to place an order
type CreateTransactionRequest struct {
	ProductID     string `json:"product_id" validate:"required"`
	PaymentMethod string `json:"payment_method" validate:"required"`
	GameUID       string `json:"game_uid" validate:"required"`
	Server        string `json:"server" validate:"required"`
	Email         string `json:"email"`
}

// TransactionListItemResponse - short view for user lists (no sensitive internal fields)
type TransactionListItemResponse struct {
	ID            string    `json:"id"`
	GameName      string    `json:"game_name"`
	ProductTitle  string    `json:"product_title"`
	Amount        int64     `json:"amount"`
	PaymentMethod string    `json:"payment_method"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
}

// TransactionDetailResponse - detailed view for owner
type TransactionDetailResponse struct {
	ID            string    `json:"id"`
	GameName      string    `json:"game_name"`
	ProductTitle  string    `json:"product_title"`
	Amount        int64     `json:"amount"`
	PaymentMethod string    `json:"payment_method"`
	PaymentURL    string    `json:"payment_url"`
	PaymentToken  string    `json:"snap_token"`
	QRString      string    `json:"qr_string,omitempty"`
	GameUID       string    `json:"game_uid"`
	Server        string    `json:"server"`
	Email         string    `json:"email"`
	Status        string    `json:"status"`
	FailureReason   string    `json:"failure_reason"`
	MayarOrderID string    `json:"mayar_order_id"`
	ExpiredAt       time.Time `json:"expired_at"`
	CreatedAt     time.Time `json:"created_at"`
}

// AdminTransactionResponse - what the admin sees
type AdminTransactionResponse struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	GameName        string    `json:"game_name"`
	ProductTitle    string    `json:"product_title"`
	Amount          int64     `json:"amount"`
	PaymentMethod   string    `json:"payment_method"`
	MayarOrderID string    `json:"mayar_order_id"`
	GameUID         string    `json:"game_uid"`
	Server          string    `json:"server"`
	Email           string    `json:"email"`
	Status          string    `json:"status"`
	FailureReason   string    `json:"failure_reason"`
	ExpiredAt       time.Time `json:"expired_at"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// UpdateTransactionStatusRequest - admin manual override
type UpdateTransactionStatusRequest struct {
	Status        string `json:"status" validate:"required"`
	FailureReason string `json:"failure_reason"`
}
