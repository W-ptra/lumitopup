package dto

import "time"

// UserResponse is the safe shape to return to clients.
type UserResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Image     string    `json:"image"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}
