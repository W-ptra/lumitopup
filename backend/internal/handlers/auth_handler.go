package handlers

import (
	"crypto/rand"
	"encoding/hex"

	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// generateState creates a random state string to prevent CSRF.
func generateState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// GoogleLogin redirects the user to the Google consent screen.
func GoogleLogin(c *fiber.Ctx) error {
	state := generateState()

	// Store state in cookie for CSRF validation on callback
	c.Cookie(&fiber.Cookie{
		Name:     "oauth_state",
		Value:    state,
		HTTPOnly: true,
		MaxAge:   300, // 5 minutes
	})

	url := services.GetLoginURL(state)
	return c.Redirect(url)
}

// GoogleCallback handles the response from Google.
func GoogleCallback(c *fiber.Ctx) error {
	state := c.Query("state")
	code := c.Query("code")

	cookieState := c.Cookies("oauth_state")
	if state != cookieState {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid OAuth state")
	}

	// Exchange code, upsert user, get JWT
	token, err := services.HandleCallback(code)
	if err != nil {
		utils.Error("OAuth callback failed", err)
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Authentication failed")
	}

	// We set it as a cookie for seamless frontend access.
	// HTTPOnly: true to prevent XSS theft.
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		HTTPOnly: true, // Secure against XSS
		Secure:   !config.AppConfig.IsDev(), // Use Secure cookie in production
		SameSite: "Lax",
		Path:     "/",
		MaxAge:   86400, // 24 hours
	})

	// Redirect back to frontend.
	// Removed the token from the query parameter to prevent leakage via Referer or browser history.
	return c.Redirect(config.AppConfig.FrontendURL + "/")
}

// Logout clears the authentication token cookie.
func Logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour), // Expired
		MaxAge:   -1,
		HTTPOnly: true,
		Secure:   !config.AppConfig.IsDev(),
		SameSite: "Lax",
		Path:     "/",
	})

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Logged out successfully",
	})
}
