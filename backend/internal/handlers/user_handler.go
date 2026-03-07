package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// GetAllUsers returns all users in the system. Admin only.
func GetAllUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := database.DB.Order("created_at desc").Find(&users).Error; err != nil {
		return utils.HTTPError(c, fiber.StatusInternalServerError, "Failed to fetch users")
	}

	var res []dto.UserResponse
	for _, u := range users {
		res = append(res, dto.UserResponse{
			ID:        u.ID,
			Name:      u.Name,
			Email:     u.Email,
			Image:     u.Image,
			Role:      u.Role,
			CreatedAt: u.CreatedAt,
		})
	}

	return utils.Success(c, res)
}

// GetMe returns the profile of the currently authenticated user.
func GetMe(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)

	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		return utils.HTTPError(c, fiber.StatusNotFound, "User not found")
	}

	res := dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Image:     user.Image,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
	}

	return utils.Success(c, res)
}
