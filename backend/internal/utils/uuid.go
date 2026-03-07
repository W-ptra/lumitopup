package utils

import (
	"errors"

	"github.com/google/uuid"
)

// ValidateUUID checks if a string is a valid UUID.
func ValidateUUID(id string) error {
	_, err := uuid.Parse(id)
	if err != nil {
		return errors.New("invalid UUID format")
	}
	return nil
}
