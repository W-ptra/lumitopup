package services

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauthConf *oauth2.Config

// InitOAuth configures the Google OAuth2 client.
func InitOAuth() {
	oauthConf = &oauth2.Config{
		ClientID:     config.AppConfig.GoogleClientID,
		ClientSecret: config.AppConfig.GoogleClientSecret,
		RedirectURL:  config.AppConfig.GoogleRedirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

// GetLoginURL returns the Google consent screen URL.
func GetLoginURL(state string) string {
	if oauthConf == nil {
		InitOAuth()
	}
	// "prompt=select_account" forces the account chooser even if already logged in
	return oauthConf.AuthCodeURL(state, oauth2.SetAuthURLParam("prompt", "select_account"))
}

// HandleCallback exchanges the code for a token and user info, then upserts the user.
func HandleCallback(code string) (string, error) {
	if oauthConf == nil {
		InitOAuth()
	}

	token, err := oauthConf.Exchange(context.Background(), code)
	if err != nil {
		return "", err
	}

	userInfo, err := getGoogleUserInfo(token.AccessToken)
	if err != nil {
		return "", err
	}

	user, isNew, err := upsertUser(userInfo)
	if err != nil {
		return "", err
	}

	if isNew {
		utils.Info("New user registered via Google", "email", user.Email, "id", user.ID)
	} else {
		utils.Info("Existing user logged in via Google", "email", user.Email, "id", user.ID)
	}

	return utils.GenerateToken(user.ID, user.Role, config.AppConfig.JWTSecret)
}

type googleUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func getGoogleUserInfo(accessToken string) (*googleUser, error) {
	data, err := utils.Get("https://www.googleapis.com/oauth2/v2/userinfo", accessToken)
	if err != nil {
		return nil, err
	}

	var gu googleUser
	if err := json.Unmarshal(data, &gu); err != nil {
		return nil, err
	}

	if gu.Email == "" {
		return nil, errors.New("failed to get email from Google profile")
	}

	return &gu, nil
}

// upsertUser finds the user by GoogleID. If not found, creates them.
func upsertUser(gu *googleUser) (*models.User, bool, error) {
	var user models.User
	result := database.DB.Where("google_id = ?", gu.ID).First(&user)

	if result.Error != nil {
		// New User
		// If it's the very first user in the system, safely make them an admin just to bootstrap?
		// Better approach: standard users are "USER", update to "ADMIN" manually in DB for now.
		user = models.User{
			GoogleID: gu.ID,
			Email:    gu.Email,
			Name:     gu.Name,
			Image:    gu.Picture,
			Role:     "USER",
		}

		if err := database.DB.Create(&user).Error; err != nil {
			return nil, false, err
		}
		return &user, true, nil
	}

	// Existing user, update image/name just in case they changed on Google
	user.Name = gu.Name
	user.Image = gu.Picture
	database.DB.Save(&user)

	return &user, false, nil
}
