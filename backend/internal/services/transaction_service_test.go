package services

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/w-ptra/lumitopup/internal/database"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// setupMockDB initializes a mock GORM database and replaces the global database.DB
func setupMockDB(t *testing.T) (sqlmock.Sqlmock, func()) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open mock sql: %v", err)
	}

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open gorm db: %v", err)
	}

	oldDB := database.DB
	database.DB = gormDB

	return mock, func() {
		database.DB = oldDB
		db.Close()
	}
}

func TestGetUserTransactions(t *testing.T) {
	mock, cleanup := setupMockDB(t)
	defer cleanup()

	userID := "user-1"
	now := time.Now()

	rows := sqlmock.NewRows([]string{"id", "user_id", "game_name", "product_title", "amount", "payment_method", "status", "created_at"}).
		AddRow("tx-1", userID, "Genshin", "100 Crystals", 10000, "QRIS", "SUCCESS", now).
		AddRow("tx-2", userID, "Valorant", "500 VP", 50000, "GOPAY", "PENDING", now.Add(-time.Hour))

	// Match the query string with regex to be more flexible
	mock.ExpectQuery(`SELECT \* FROM "transactions" WHERE user_id = \$1.*ORDER BY created_at desc`).
		WithArgs(userID).
		WillReturnRows(rows)

	res, err := GetUserTransactions(userID)

	assert.NoError(t, err)
	assert.Len(t, res, 2)
	assert.Equal(t, "tx-1", res[0].ID)
}

func TestGetTransactionDetail_Found(t *testing.T) {
	mock, cleanup := setupMockDB(t)
	defer cleanup()

	txID := "tx-1"
	userID := "user-1"
	now := time.Now()

	rows := sqlmock.NewRows([]string{"id", "user_id", "game_name", "product_title", "amount", "payment_method", "status", "expired_at", "created_at"}).
		AddRow(txID, userID, "Genshin", "100 Crystals", 10000, "QRIS", "SUCCESS", now.Add(time.Hour), now)

	// Match any query
	mock.ExpectQuery(".*").
		WillReturnRows(rows)

	res, err := GetTransactionDetail(txID, userID, false)

	assert.NoError(t, err)
	assert.NotNil(t, res)
}



func TestGetTransactionDetail_NotFound(t *testing.T) {
	mock, cleanup := setupMockDB(t)
	defer cleanup()

	txID := "non-existent"
	userID := "user-1"

	mock.ExpectQuery(`SELECT \* FROM "transactions".*WHERE.*id = \$1.*user_id = \$2.*`).
		WithArgs(txID, userID).
		WillReturnError(gorm.ErrRecordNotFound)

	res, err := GetTransactionDetail(txID, userID, false)

	assert.Error(t, err)
	assert.Nil(t, res)
}


