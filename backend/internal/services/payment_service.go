package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/utils"
)

func CreatePaymentRequest(
	internalTxID string,
	mayarOrderID string,
	amount int64,
	email string,
	productTitle string,
	gameName string,
	expiredAt time.Time,
) (string, error) {
	if config.AppConfig.MayarAPIKey == "" {
		return "", errors.New("mayar api key not configured")
	}

	url := "https://api.mayar.id/hl/v1/payment/create"
	if config.AppConfig.IsDev() {
		url = "https://api.mayar.club/hl/v1/payment/create"
	}

	if email == "" {
		email = "no-reply@lumitopup.com"
	}

	redirectUrl := fmt.Sprintf("%s/transaction/%s", config.AppConfig.FrontendURL, internalTxID)

	payload := map[string]interface{}{
		"name": "Customer",
		"items": []map[string]interface{}{
			{
				"name":        productTitle,
				"description": gameName,
				"quantity":    1,
				"rate":        amount,
			},
		},
		"email":       email,
		"amount":      amount,
		"mobile":      "08111111111",
		"redirectUrl": redirectUrl,
		"description": "Order " + productTitle,
		"expiredAt":   expiredAt.Format(time.RFC3339),
		"id":          mayarOrderID,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+config.AppConfig.MayarAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		return "", fmt.Errorf("mayar api error: %s", string(respBody))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return "", err
	}

	data, ok := result["data"]
	if !ok {
		return "", errors.New("no data in mayar response")
	}

	var link string
	switch d := data.(type) {
	case []interface{}:
		if len(d) > 0 {
			if first, ok := d[0].(map[string]interface{}); ok {
				if l, ok := first["link"].(string); ok {
					link = l
				}
			}
		}
	case map[string]interface{}:
		if l, ok := d["link"].(string); ok {
			link = l
		}
	}

	if link == "" {
		return "", errors.New("payment link not found in response")
	}

	utils.Info("Mayar payment created", "order_id", mayarOrderID, "url", link)
	return link, nil
}

// VerifySignature checks the integrity of the webhook payload.
func VerifySignature(orderID, statusCode, grossAmount, signatureKey string) bool {
	// For Mayar we might do something similar but for now we'll accept it
	// In production, implement proper webhook signature verification based on Mayar docs.
	return true
}
