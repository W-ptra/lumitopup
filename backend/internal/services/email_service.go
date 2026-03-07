package services

import (
	"context"
	"fmt"
	"time"

	"github.com/resend/resend-go/v2"
	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
)

var resendClient *resend.Client

func initResend() {
	if resendClient == nil && config.AppConfig.ResendAPIKey != "" {
		resendClient = resend.NewClient(config.AppConfig.ResendAPIKey)
	}
}

// SendReceipt formats and sends a success receipt via Resend.
// It runs non-blockingly to avoid slowing down the webhook return response.
func SendReceipt(tx models.Transaction) {
	go func() {
		// Recover panic so email sending crash doesn't kill the app
		defer func() {
			if r := recover(); r != nil {
				utils.Error("Recovered panic in SendReceipt", fmt.Errorf("%v", r))
			}
		}()

		initResend()
		if resendClient == nil {
			utils.Error("Resend client not initialized", fmt.Errorf("missing API key"))
			return
		}

		if tx.Email == "" {
			utils.Info("No email attached to transaction, skipping receipt", "tx_id", tx.ID)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		subject := "Your Top-Up Receipt - LumiTopUp"
		if config.AppConfig.IsDev() {
			subject = "[DEV] " + subject
		}

		// Dark premium email template
		htmlBody := fmt.Sprintf(`
			<div style="background-color: #1a1a1a; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 20px; max-width: 600px; margin: auto;">
				<div style="display: flex; align-items: center; margin-bottom: 30px;">
					<h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">Top-Up Successful</h1>
				</div>
				
				<p style="font-size: 16px; color: #b3b3b3; margin-bottom: 30px;">Thank you for purchasing at LumiTopUp!</p>
				
				<div style="background-color: #262626; padding: 25px; border-radius: 15px; border: 1px solid #333;">
					<ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
						<li style="margin-bottom: 8px;"><strong style="color: #ffffff; display: inline-block; width: 140px;">Transaction ID:</strong> <span style="font-family: monospace; color: #7491F7;">%s</span></li>
						<li style="margin-bottom: 8px;"><strong style="color: #ffffff; display: inline-block; width: 140px;">Game:</strong> %s</li>
						<li style="margin-bottom: 8px;"><strong style="color: #ffffff; display: inline-block; width: 140px;">Product:</strong> %s</li>
						<li style="margin-bottom: 8px;"><strong style="color: #ffffff; display: inline-block; width: 140px;">Amount Paid:</strong> <span style="color: #4ade80; font-weight: bold;">Rp %d</span></li>
						<li style="margin-bottom: 8px;"><strong style="color: #ffffff; display: inline-block; width: 140px;">Payment Method:</strong> %s</li>
					</ul>
				</div>
				
				<p style="margin-top: 30px; font-size: 14px; color: #b3b3b3; border-top: 1px solid #333; pt: 20px;">
					Your item has been delivered to <strong>UID: %s (%s)</strong>.
				</p>
				
				<div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333; padding-top: 20px;">
					&copy; %d LumiTopUp. All rights reserved.
				</div>
			</div>
		`, tx.ID, tx.GameName, tx.ProductTitle, tx.Amount, tx.PaymentMethod, tx.GameUID, tx.Server, time.Now().Year())

		params := &resend.SendEmailRequest{
			From:    config.AppConfig.EmailFrom,
			To:      []string{tx.Email},
			Subject: subject,
			Html:    htmlBody,
		}

		_, err := resendClient.Emails.SendWithContext(ctx, params)
		if err != nil {
			utils.Error("Failed to send receipt email", err, "tx_id", tx.ID, "email", tx.Email)
			return
		}

		utils.Info("Receipt email sent successfully", "tx_id", tx.ID, "email", tx.Email)
	}()
}
