package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

var httpClient = &http.Client{Timeout: 15 * time.Second}

// Post sends an authenticated JSON POST request and returns the response body.
func Post(url, apiKey string, payload any) ([]byte, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	return doRequest(req)
}

// Get sends an authenticated GET request and returns the response body.
func Get(url, apiKey string) ([]byte, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)

	return doRequest(req)
}

func doRequest(req *http.Request) ([]byte, error) {
	// Security: Ensure we only talk to HTTPS (or localhost for dev)
	if !strings.HasPrefix(req.URL.Scheme, "https") && !strings.Contains(req.URL.Host, "localhost") {
		return nil, errors.New("insecure URL scheme or host")
	}

	// #nosec G704 -- This is a shared utility where URL is expected to be provided by trusted services.
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("upstream returned status %d: %s", resp.StatusCode, string(responseBody))
	}

	return responseBody, nil
}
