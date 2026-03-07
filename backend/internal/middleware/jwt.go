package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// JWTProtected ensures that a valid JWT token is present in the request.
// It checks the Authorization: Bearer header, then falls back to a cookie named "token".
func JWTProtected(c *fiber.Ctx) error {
	var tokenStr string

	// 1. Try Authorization header
	authHeader := c.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
	} else {
		// 2. Try cookie
		cookieToken := c.Cookies("token")
		if cookieToken != "" {
			tokenStr = cookieToken
		}
	}

	if tokenStr == "" {
		return utils.HTTPError(c, fiber.StatusUnauthorized, "Missing or malformed JWT")
	}

	claims, err := utils.ParseToken(tokenStr, config.AppConfig.JWTSecret)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusUnauthorized, "Invalid or expired JWT")
	}

	// Inject claims into context
	c.Locals("user_id", claims.UserID)
	c.Locals("role", claims.Role)

	return c.Next()
}

// AdminOnly ensures the user has the ADMIN role. Must be used AFTER JWTProtected.
func AdminOnly(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role == nil || role.(string) != "ADMIN" {
		return utils.HTTPError(c, fiber.StatusForbidden, "Requires ADMIN privileges")
	}
	return c.Next()
}
