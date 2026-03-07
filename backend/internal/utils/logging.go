package utils

import (
	"log/slog"
	"os"
)

var logger *slog.Logger

// InitLogger sets up the global logger.
// In dev mode it uses a human-readable text format; in prod it uses JSON.
func InitLogger(isDev bool) {
	var handler slog.Handler
	if isDev {
		handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})
	} else {
		handler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	}
	logger = slog.New(handler)
	slog.SetDefault(logger)
}

// Info logs an informational message with optional structured key-value pairs.
func Info(msg string, args ...any) {
	logger.Info(msg, args...)
}

// Error logs an error with the underlying error and optional key-value pairs.
func Error(msg string, err error, args ...any) {
	combined := append([]any{"error", err}, args...)
	logger.Error(msg, combined...)
}
