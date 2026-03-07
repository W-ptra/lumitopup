package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv             string
	Host               string
	Port               string
	DatabaseURL        string
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
	JWTSecret          string
	ResendAPIKey       string
	EmailFrom          string
	FrontendURL        string
	MayarAPIKey        string
	TopupAPIURL        string
	TopupAPIKey        string
	Timezone           *time.Location
}

// AppConfig is the single shared config instance loaded at startup.
var AppConfig Config

// Load reads the .env file and populates AppConfig.
// It also sets the process-wide timezone to Asia/Jakarta (WIB).
func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	jakartaLocation, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		log.Fatal("Failed to load Asia/Jakarta timezone:", err)
	}

	// Set process-wide default so all time.Now() calls return WIB.
	time.Local = jakartaLocation

	AppConfig = Config{
		AppEnv:             getEnv("APP_ENV", "dev"),
		Host:               getEnv("HOST", "0.0.0.0"),
		Port:               getEnv("PORT", "8000"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:  getEnv("GOOGLE_REDIRECT_URL", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		ResendAPIKey:       getEnv("RESEND_API_KEY", ""),
		EmailFrom:          getEnv("EMAIL_FROM", ""),
		FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:5173"),
		MayarAPIKey:        getEnv("MAYAR_API_KEY", ""),
		TopupAPIURL:        getEnv("TOPUP_API_URL", ""),
		TopupAPIKey:        getEnv("TOPUP_API_KEY", ""),
		Timezone:           jakartaLocation,
	}
}

// IsDev returns true when the app is running in development mode.
func (c *Config) IsDev() bool {
	return c.AppEnv == "dev"
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
