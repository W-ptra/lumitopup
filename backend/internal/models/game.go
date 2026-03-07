package models

import (
	"time"

	"gorm.io/gorm"
)

// Game represents a top-up game catalog item.
type Game struct {
	ID        string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string `gorm:"uniqueIndex;not null"`
	Image     string
	Active    bool `gorm:"default:true"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

