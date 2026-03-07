package services

import (
	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// Deliver connects to the chosen 3rd party API (Smile.One, Unipin, VIP, etc.)
// to deliver game goods after a successful transaction.
func Deliver(tx models.Transaction) error {
	utils.Info("Attempting top-up delivery", "tx_id", tx.ID, "game", tx.GameName, "uid", tx.GameUID)

	// In real life this would map internal Product ID to the Provider's item ID.
	// We'll mock the actual HTTP call for now until the exact provider endpoint is known.

	apiURL := config.AppConfig.TopupAPIURL
	apiKey := config.AppConfig.TopupAPIKey

	if apiURL == "" || apiKey == "" {
		utils.Error("Topup API credentials missing, skipping delivery", nil, "tx_id", tx.ID)
		// Return nil if credentials missing so we don't crash, but log it loudly.
		return nil
	}

	payload := map[string]any{
		"reference_id": tx.ID,
		"game_code":    tx.GameName,
		"item_code":    tx.ProductTitle,
		"user_id":      tx.GameUID,
		"zone_id":      tx.Server,
	}

	utils.Info("Sending Request to Topup API", "url", apiURL)

	// Example of using the shared API Client:
	// resp, err := utils.Post(apiURL+"/order", apiKey, payload)
	// if err != nil {
	//    utils.Error("Failed to deliver top-up", err, "tx_id", tx.ID)
	//    return err
	// }
	// utils.Info("Topup delivery successful", "resp", string(resp))

	// Mock success implementation
	_ = payload
	utils.Info("Topup delivery simulated successfully", "tx_id", tx.ID)

	return nil
}
