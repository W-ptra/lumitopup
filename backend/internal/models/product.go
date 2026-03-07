package models

import (
	"time"

	"gorm.io/gorm"
)

// Product represents a specific top-up denomination for a game.
type Product struct {
	ID        	  string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	GameID        string `gorm:"type:uuid;not null;index"`
	Game          Game   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Title         string `gorm:"not null"`
	Price         int64  `gorm:"not null"`
	OriginalPrice *int64
	Image         string
	Active        bool `gorm:"default:true"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
}
