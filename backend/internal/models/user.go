package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the database.
type User struct {
	ID        string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	GoogleID  string `gorm:"uniqueIndex;not null"`
	Name      string `gorm:"not null"`
	Email     string `gorm:"uniqueIndex;not null"`
	Image     string
	Role      string `gorm:"default:'USER'"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
