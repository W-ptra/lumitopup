package database

import (
	"time"

	"github.com/w-ptra/lumitopup/internal/config"
	"github.com/w-ptra/lumitopup/internal/models"
	"github.com/w-ptra/lumitopup/internal/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the shared database connection used by all services.
var DB *gorm.DB
const maxOpenConnection int = 50
const maxIdleConnection int = 25
const maxConnMaxLifetime int = 1

// Connect opens a PostgreSQL connection and runs AutoMigrate for all models.
func Connect() {
	db, err := gorm.Open(postgres.Open(config.AppConfig.DatabaseURL), &gorm.Config{})
	if err != nil {
		utils.Error("Failed to connect to database", err)
		panic(err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		utils.Error("Failed to get sql.DB", err)
		panic(err)
	}

	sqlDB.SetMaxOpenConns(maxOpenConnection)
	sqlDB.SetMaxIdleConns(maxIdleConnection)
	sqlDB.SetConnMaxLifetime(time.Duration(maxConnMaxLifetime) * time.Hour)

	if err := db.AutoMigrate(
		&models.User{},
		&models.Game{},
		&models.Product{},
		&models.Transaction{},
	); err != nil {
		utils.Error("Failed to run database migrations", err)
		panic(err)
	}

	DB = db
	utils.Info("Database connected and migrations applied successfully")
}
