package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/w-ptra/lumitopup/internal/services"
	"github.com/w-ptra/lumitopup/internal/utils"
)

// MayarWebhookPayload shape for Mayar notifications
type MayarWebhookPayload struct {
	Event string `json:"event"`
	Data  struct {
		ID            string `json:"id"`
		Status        string `json:"status"`
		Amount        int64  `json:"amount"`
		CustomerEmail string `json:"customerEmail"`
	} `json:"data"`
}

// WebhookMayar handles asynchronous notifications from Mayar.
func WebhookMayar(c *fiber.Ctx) error {
	var n MayarWebhookPayload

	// Log incoming webhook for debugging
	utils.Info("Mayar Webhook received", "body", string(c.Body()))

	if err := json.Unmarshal(c.Body(), &n); err != nil {
		utils.Error("Failed parsing webhook body", err)
		return c.SendStatus(fiber.StatusBadRequest)
	}

	// Support testing event
	if n.Event == "testing" {
		utils.Info("Mayar Webhook testing event received", "id", n.Data.ID)
		// For testing event, we can just return 200 or process as success if needed
	}

	utils.Info("Mayar Webhook processing", "event", n.Event, "id", n.Data.ID, "status", n.Data.Status)

	// Note: Signature verification should be updated if Mayar provides a signature in headers or payload.
	// For now we keep it simple as per earlier implementation or documentation.

	// 2. Map Mayar Status to Internal Status
	var status string
	var failure string

	switch n.Data.Status {
	case "SUCCESS", "PAID", "paid":
		status = "SUCCESS"
	case "PENDING", "pending":
		status = "PENDING"
	case "FAILED", "failed", "EXPIRED", "expired":
		status = "FAILED"
		failure = "Payment failed or expired"
	}

	// 3. Update Transaction and trigger side-effects (delivery/email)
	if status != "" && n.Data.ID != "" {
		if err := services.UpdateFromWebhook(n.Data.ID, status, failure); err != nil {
			utils.Error("Webhook DB update failed", err, "mayar_order_id", n.Data.ID)
			// Return 200 even if it fails to find the transaction (maybe a test or old tx)
			// or return 500 so they retry. In case of "testing" event, it might not exist in DB.
			if n.Event == "testing" {
				return c.SendStatus(fiber.StatusOK)
			}
			return c.SendStatus(fiber.StatusInternalServerError)
		}
	}

	return c.SendStatus(fiber.StatusOK)
}
