package dto

import "time"

// CreateProductRequest
type CreateProductRequest struct {
	GameID        string `json:"game_id" validate:"required"`
	Title         string `json:"title" validate:"required"`
	Price         int64  `json:"price" validate:"required"`
	OriginalPrice *int64 `json:"original_price"`
	Image         string `json:"image"`
	Active        *bool  `json:"active"`
}

// UpdateProductRequest
type UpdateProductRequest struct {
	Title         string `json:"title"`
	Price         int64  `json:"price"`
	OriginalPrice *int64 `json:"original_price"`
	Image         string `json:"image"`
	Active        *bool  `json:"active"`
}

// ProductResponse
type ProductResponse struct {
	ID            string    `json:"id"`
	GameID        string    `json:"game_id"`
	Title         string    `json:"title"`
	Price         int64     `json:"price"`
	OriginalPrice *int64    `json:"original_price"`
	Image         string    `json:"image"`
	Active        bool      `json:"active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
