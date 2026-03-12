package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/w-ptra/lumitopup/internal/handlers"
	"github.com/w-ptra/lumitopup/internal/middleware"
)

// Register attaches all application routes to the fiber engine.
func Register(app *fiber.App) {
	// Add Logger and Recover middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Root Group
	api := app.Group("/api/v1")

	// Webhooks (Public, must verify signature internally)
	api.Post("/webhook/mayar", handlers.WebhookMayar)

	// Auth (Public)
	auth := api.Group("/auth")
	auth.Get("/google", handlers.GoogleLogin)
	auth.Get("/google/callback", handlers.GoogleCallback)
	auth.Post("/logout", handlers.Logout)

	// Public Catalogs
	api.Get("/games", handlers.GetGames)
	api.Get("/games/:id/products", handlers.GetGameProducts)

	// Protected Routes (User-level)
	api.Use(middleware.JWTProtected)

	// User Profile
	api.Get("/users/me", handlers.GetMe)

	// User Transactions
	api.Get("/transactions", handlers.GetUserTransactions)
	api.Post("/transactions", handlers.CreateTransaction)
	api.Get("/transactions/:id", handlers.GetTransactionDetail)

	// Admin Routes
	admin := api.Group("/admin")
	admin.Use(middleware.AdminOnly)

	// Admin - Users
	admin.Get("/users", handlers.GetAllUsers)

	// Admin - Games
	admin.Post("/games", handlers.CreateGame)
	admin.Put("/games/:id", handlers.UpdateGame)
	admin.Delete("/games/:id", handlers.DeleteGame)

	// Admin - Products
	admin.Get("/products", handlers.GetAllProducts)
	admin.Post("/products", handlers.CreateProduct)
	admin.Put("/products/:id", handlers.UpdateProduct)
	admin.Delete("/products/:id", handlers.DeleteProduct)

	// Admin - Transactions
	admin.Get("/transactions", handlers.AdminGetAllTransactions)
	admin.Patch("/transactions/:id/status", handlers.AdminUpdateTransactionStatus)
}
