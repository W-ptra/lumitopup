package models

import (
	"time"

	"gorm.io/gorm"
)

// Transaction represents a top-up order.
type Transaction struct {
	ID              string  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID          string  `gorm:"type:uuid;not null;index"`
	User            User    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	ProductID       string  `gorm:"type:uuid;not null;index"`
	Product         Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	GameName        string  `gorm:"not null"`
	ProductTitle    string  `gorm:"not null"`
	Amount          int64   `gorm:"not null"`
	PaymentMethod   string  `gorm:"not null"`
	MayarOrderID string  `gorm:"uniqueIndex"`
	PaymentURL      string
	PaymentToken    string
	QRString        string
	GameUID         string `gorm:"not null"`
	Server          string `gorm:"not null"`
	Email           string
	Status          string `gorm:"default:'PENDING';index"`
	FailureReason   string
	ExpiredAt       time.Time `gorm:"not null"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       gorm.DeletedAt `gorm:"index"`
}
