package services

import (
	"errors"

	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/models"
)

// GetAllProducts gets all products globally (Admin tool).
func GetAllProducts() ([]dto.ProductResponse, error) {
	var prods []models.Product
	if err := database.DB.Find(&prods).Error; err != nil {
		return nil, err
	}

	var res []dto.ProductResponse
	for _, p := range prods {
		res = append(res, mapProductToResponse(p))
	}
	return res, nil
}

// CreateProduct adds a new denomination.
func CreateProduct(req dto.CreateProductRequest) (*dto.ProductResponse, error) {
	active := true
	if req.Active != nil {
		active = *req.Active
	}

	prod := models.Product{
		GameID:        req.GameID,
		Title:         req.Title,
		Price:         req.Price,
		OriginalPrice: req.OriginalPrice,
		Image:         req.Image,
		Active:        active,
	}

	if err := database.DB.Create(&prod).Error; err != nil {
		return nil, err
	}

	res := mapProductToResponse(prod)
	return &res, nil
}

// UpdateProduct updates product details.
func UpdateProduct(id string, req dto.UpdateProductRequest) (*dto.ProductResponse, error) {
	var prod models.Product
	if err := database.DB.First(&prod, "id = ?", id).Error; err != nil {
		return nil, errors.New("product not found")
	}

	if req.Title != "" {
		prod.Title = req.Title
	}
	if req.Price > 0 {
		prod.Price = req.Price
	}
	if req.OriginalPrice != nil {
		prod.OriginalPrice = req.OriginalPrice
	}
	if req.Image != "" {
		prod.Image = req.Image
	}
	if req.Active != nil {
		prod.Active = *req.Active
	}

	if err := database.DB.Save(&prod).Error; err != nil {
		return nil, err
	}

	res := mapProductToResponse(prod)
	return &res, nil
}

// DeleteProduct hard-deletes a product.
func DeleteProduct(id string) error {
	result := database.DB.Delete(&models.Product{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("product not found")
	}
	return nil
}
