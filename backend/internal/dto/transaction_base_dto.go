package dto

// Update TransactionResponse to fix reference issue in services
type TransactionResponse struct {
	ID            string `json:"id"`
	GameName      string `json:"game_name"`
	ProductTitle  string `json:"product_title"`
	Amount        int64  `json:"amount"`
	PaymentMethod string `json:"payment_method"`
	PaymentURL    string `json:"payment_url"`
	Status        string `json:"status"`
	ExpiredAt     string `json:"expired_at"`
	CreatedAt     string `json:"created_at"`
}
