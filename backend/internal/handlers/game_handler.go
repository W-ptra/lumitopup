package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// GetGames returns active games to public, or all games to admin.
func GetGames(c *fiber.Ctx) error {
	role := c.Locals("role")
	isAdmin := role != nil && role.(string) == "ADMIN"

	var games []dto.GameResponse
	var err error

	if isAdmin {
		games, err = services.GetAllGames()
	} else {
		games, err = services.GetActiveGames()
	}

	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to fetch games")
	}

	return utils.Success(c, games)
}

// GetGameProducts returns active products for a specific game.
func GetGameProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := utils.ValidateUUID(id); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid game ID format")
	}

	res, err := services.GetGameWithActiveProducts(id)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusNotFound, err.Error())
	}

	return utils.Success(c, res)
}

// CreateGame creates a new catalog item.
func CreateGame(c *fiber.Ctx) error {
	var req dto.CreateGameRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}
	if req.Name == "" {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Name is required")
	}

	res, err := services.CreateGame(req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to create game")
	}

	return utils.Success(c, res)
}

// UpdateGame updates catalog details.
func UpdateGame(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := utils.ValidateUUID(id); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid game ID format")
	}

	var req dto.UpdateGameRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid request body")
	}

	res, err := services.UpdateGame(id, req)
	if err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, res)
}

// DeleteGame deletes a catalog item.
func DeleteGame(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := utils.ValidateUUID(id); err != nil {
		return utils.HTTPError(c, fiber.StatusBadRequest, "Invalid game ID format")
	}

	if err := services.DeleteGame(id); err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.Map{"message": "Game deleted successfully"})
}
