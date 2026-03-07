package utils

import "github.com/gofiber/fiber/v2"

type successResponse struct {
	Success bool `json:"success"`
	Data    any  `json:"data"`
}

type errorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Success sends a 200 JSON response in the shape: {"success": true, "data": ...}
func Success(c *fiber.Ctx, data any) error {
	return c.Status(fiber.StatusOK).JSON(successResponse{
		Success: true,
		Data:    data,
	})
}

// HTTPError sends a JSON error response in the shape: {"success": false, "message": ...}
func HTTPError(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(errorResponse{
		Success: false,
		Message: message,
	})
}
