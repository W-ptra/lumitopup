package utils

import (
	"crypto/sha512"
	"encoding/hex"
)

// GenerateSHA512 creates a SHA-512 hash string from input.
func GenerateSHA512(input string) string {
	hasher := sha512.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}
