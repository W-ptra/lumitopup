package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// CreateTransaction initiates a Mayar payment and stores order.
func CreateTransaction(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	var req dto.CreateTransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.ProductID == "" || req.PaymentMethod == "" || req.GameUID == "" || req.Server == "" {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Missing required fields")
	}

	if err := utils.ValidateUUID(req.ProductID); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid product ID format")
	}

	res, err := services.CreateTransaction(userID, req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, res)
}

// GetUserTransactions returns user's historically orders.
func GetUserTransactions(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	res, err := services.GetUserTransactions(userID)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to retrieve transactions")
	}

	return utils.Success(c, res)
}

// GetTransactionDetail returns specific order detail with lazy expiry check.
func GetTransactionDetail(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	role := c.Locals("role")
	isAdmin := role != nil && role.(string) == "ADMIN"
	txID := c.Params("id")
	if err := utils.ValidateUUID(txID); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid transaction ID format")
	}

	res, err := services.GetTransactionDetail(txID, userID, isAdmin)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusNotFound, err.Error())
	}

	return utils.Success(c, res)
}

// AdminGetAllTransactions returns raw list of all orders.
func AdminGetAllTransactions(c *fiber.Ctx) error {
	res, err := services.GetAllTransactions()
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to retrieve transactions")
	}
	return utils.Success(c, res)
}

// AdminUpdateTransactionStatus forces status override.
func AdminUpdateTransactionStatus(c *fiber.Ctx) error {
	txID := c.Params("id")
	if err := utils.ValidateUUID(txID); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid transaction ID format")
	}
	var req dto.UpdateTransactionStatusRequest

	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}
	if req.Status == "" {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Status required")
	}

	res, err := services.UpdateTransactionStatus(txID, req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, res)
}
