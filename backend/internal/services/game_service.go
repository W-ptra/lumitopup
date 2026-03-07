package services

import (
	"errors"

	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/dto"
	"github.com/w-ptra/lumitopup/internal/models"
)

func mapGameToResponse(g models.Game) dto.GameResponse {
	return dto.GameResponse{
		ID:        g.ID,
		Name:      g.Name,
		Image:     g.Image,
		Active:    g.Active,
		CreatedAt: g.CreatedAt,
		UpdatedAt: g.UpdatedAt,
	}
}

// GetActiveGames returns all games visible to users.
func GetActiveGames() ([]dto.GameResponse, error) {
	var games []models.Game
	if err := database.DB.Where("active = ?", true).Find(&games).Error; err != nil {
		return nil, err
	}

	var res []dto.GameResponse
	for _, g := range games {
		res = append(res, mapGameToResponse(g))
	}
	return res, nil
}

// GetAllGames returns all games (for admin).
func GetAllGames() ([]dto.GameResponse, error) {
	var games []models.Game
	if err := database.DB.Find(&games).Error; err != nil {
		return nil, err
	}

	var res []dto.GameResponse
	for _, g := range games {
		res = append(res, mapGameToResponse(g))
	}
	return res, nil
}

// GetGameWithActiveProducts returns a game and its active products.
func GetGameWithActiveProducts(gameID string) (*dto.GameWithProductsResponse, error) {
	var game models.Game
	if err := database.DB.First(&game, "id = ?", gameID).Error; err != nil {
		return nil, errors.New("game not found")
	}

	var prods []models.Product
	if err := database.DB.Where("game_id = ? AND active = ?", gameID, true).Find(&prods).Error; err != nil {
		return nil, err
	}

	var prodRes []dto.ProductResponse
	for _, p := range prods {
		prodRes = append(prodRes, mapProductToResponse(p))
	}

	paymentMethods := []dto.PaymentMethodResponse{
		{ID: "qris", Name: "QRIS", Logo: "/qris-logo.png", Charge: dto.ChargeResponse{Type: "PERCENTAGE", Value: 0.7}},
		// {ID: "gopay", Name: "GoPay", Logo: "/gopay-logo.png", Charge: dto.ChargeResponse{Type: "PERCENTAGE", Value: 2}},
		// {ID: "dana", Name: "DANA", Logo: "/dana-logo.png", Charge: dto.ChargeResponse{Type: "PERCENTAGE", Value: 2}},
		// {ID: "ovo", Name: "OVO", Logo: "/ovo-logo.png", Charge: dto.ChargeResponse{Type: "PERCENTAGE", Value: 2}},
		{ID: "shopeepay", Name: "ShopeePay", Logo: "/shopeepay-logo.png", Charge: dto.ChargeResponse{Type: "PERCENTAGE", Value: 2}},
		{ID: "bni", Name: "BNI Virtual Account", Logo: "/bni-logo.png", Charge: dto.ChargeResponse{Type: "FIXED", Value: 4000}},
		{ID: "bri", Name: "BRI Virtual Account", Logo: "/bri-logo.png", Charge: dto.ChargeResponse{Type: "FIXED", Value: 4000}},
		{ID: "mandiri", Name: "Mandiri FPA", Logo: "/mandiri-logo.png", Charge: dto.ChargeResponse{Type: "FIXED", Value: 4000}},
		{ID: "permata", Name: "Permata Virtual Account", Logo: "/permata-logo.png", Charge: dto.ChargeResponse{Type: "FIXED", Value: 4000}},
	}

	return &dto.GameWithProductsResponse{
		ID:             game.ID,
		Name:           game.Name,
		Image:          game.Image,
		Products:       prodRes,
		PaymentMethods: paymentMethods,
	}, nil
}

// CreateGame creates a new game.
func CreateGame(req dto.CreateGameRequest) (*dto.GameResponse, error) {
	active := true
	if req.Active != nil {
		active = *req.Active
	}

	game := models.Game{
		Name:   req.Name,
		Image:  req.Image,
		Active: active,
	}

	if err := database.DB.Create(&game).Error; err != nil {
		return nil, err
	}

	res := mapGameToResponse(game)
	return &res, nil
}

// UpdateGame updates a game.
func UpdateGame(id string, req dto.UpdateGameRequest) (*dto.GameResponse, error) {
	var game models.Game
	if err := database.DB.First(&game, "id = ?", id).Error; err != nil {
		return nil, errors.New("game not found")
	}

	if req.Name != "" {
		game.Name = req.Name
	}
	if req.Image != "" {
		game.Image = req.Image
	}
	if req.Active != nil {
		game.Active = *req.Active
	}

	if err := database.DB.Save(&game).Error; err != nil {
		return nil, err
	}

	res := mapGameToResponse(game)
	return &res, nil
}

// DeleteGame hard-deletes a game.
func DeleteGame(id string) error {
	result := database.DB.Delete(&models.Game{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("game not found")
	}
	return nil
}

// mapProductToResponse is a helper shared locally.
func mapProductToResponse(p models.Product) dto.ProductResponse {
	return dto.ProductResponse{
		ID:            p.ID,
		GameID:        p.GameID,
		Title:         p.Title,
		Price:         p.Price,
		OriginalPrice: p.OriginalPrice,
		Image:         p.Image,
		Active:        p.Active,
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
	}
}
