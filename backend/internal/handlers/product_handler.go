package handlers

import (


	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// GetAllProducts returns all products (Admin only).
func GetAllProducts(c *fiber.Ctx) error {
	res, err := services.GetAllProducts()
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to fetch products")
	}
	return utils.Success(c, res)
}

// CreateProduct creates a new denomination.
func CreateProduct(c *fiber.Ctx) error {
	var req dto.CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.GameID == "" || req.Title == "" || req.Price <= 0 {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Missing required fields")
	}

	res, err := services.CreateProduct(req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, res)
}

// UpdateProduct updates product details.
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := utils.ValidateUUID(id); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid product ID format")
	}

	var req dto.UpdateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}

	res, err := services.UpdateProduct(id, req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, res)
}

// DeleteProduct deletes a denomination.
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := utils.ValidateUUID(id); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid product ID format")
	}

	if err := services.DeleteProduct(id); err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.Map{"message": "Product deleted successfully"})
}
