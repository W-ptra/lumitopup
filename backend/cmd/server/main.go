package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/database"
	"github.com/w-ptra/lumitopup/internal/routes"
	"github.com/w-ptra/lumitopup/internal/utils"
)

const ReadTimeoutConst int = 5
const WriteTimeoutConst int = 10
const IdleTimeoutConst int = 60
const ReadBufferSizeConst int = 4096
const WriteBufferSizeConst int = 4096
const ConcurrencyConst int = 1024

func main() {
	// 1. Load config (.env and Timezone WIB)
	config.Load()

	// 2. Init global structured logger
	utils.InitLogger(config.AppConfig.IsDev())
	utils.Info("Starting LumiTopUp API", "env", config.AppConfig.AppEnv)

	// 3. Connect DB & AutoMigrate
	database.Connect()

	// 4. Setup Fiber App with sane defaults
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,

		ReadTimeout:  time.Duration(ReadTimeoutConst) * time.Second,
		WriteTimeout: time.Duration(WriteTimeoutConst) * time.Second,
		IdleTimeout:  time.Duration(IdleTimeoutConst) * time.Second,

		ReadBufferSize:  ReadBufferSizeConst,
		WriteBufferSize: WriteBufferSizeConst,

		Concurrency: ConcurrencyConst,

		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			if code >= 500 {
				utils.Error("Unhandled runtime error", err, "path", c.Path())
			}
			return utils.HTTPError(c, code, err.Error())
		},
	})

	// Add CORS for Frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.AppConfig.FrontendURL,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// 5. Register all API endpoints
	routes.Register(app)

	// 6. Start Server
	hostPort := fmt.Sprintf("%s:%s", config.AppConfig.Host, config.AppConfig.Port)
	utils.Info("Server listening", "address", hostPort)

	if err := app.Listen(hostPort); err != nil {
		log.Fatalf("Fiber failed to start: %v", err)
		os.Exit(1)
	}
}
