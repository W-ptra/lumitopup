package dto

import "time"

// CreateGameRequest
type CreateGameRequest struct {
	Name   string `json:"name" validate:"required"`
	Image  string `json:"image"`
	Active *bool  `json:"active"`
}

// UpdateGameRequest
type UpdateGameRequest struct {
	Name   string `json:"name"`
	Image  string `json:"image"`
	Active *bool  `json:"active"`
}

// GameResponse
type GameResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Image     string    `json:"image"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ChargeResponse struct {
	Type  string  `json:"type"`
	Value float64 `json:"value"`
}

type PaymentMethodResponse struct {
	ID     string         `json:"id"`
	Name   string         `json:"name"`
	Logo   string         `json:"logo"`
	Charge ChargeResponse `json:"charge"`
}

// GameWithProductsResponse (used for public list)
type GameWithProductsResponse struct {
	ID             string                  `json:"id"`
	Name           string                  `json:"name"`
	Image          string                  `json:"image"`
	Products       []ProductResponse       `json:"products"`
	PaymentMethods []PaymentMethodResponse `json:"payment_methods"`
}
