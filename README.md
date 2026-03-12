# 💎 LumiTopUp - Premium Game Top-Up Platform

LumiTopUp is a modern, fast, and secure game top-up platform designed for high-performance digital transactions. Built with a robust Go backend and a sleek React frontend, it features deep integration with the Mayar payment gateway for a seamless user experience.

---

## 🚀 Features

-   **Instant Checkout**: Direct redirection to payment portals for zero-friction user journeys.
-   **Mayar Integration**: Full support for Mayar Invoices, QRIS, and automated webhooks.
-   **Active Status Sync**: Automated layer to verify payment status directly with Mayar APIs if webhooks are delayed.
-   **Premium UI/UX**: Stunning modern design with dark mode aesthetics, glassmorphism, and smooth micro-animations.
-   **Google OAuth**: Secure and easy authentication for customers.
-   **Admin Dashboard**: Comprehensive management of games, products, and transaction history.
-   **Fault-Tolerant UI**: Smart initial-based fallbacks for broken images to maintain a premium look.

---

## 🛠 Technologies used

#### Frontend
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

#### Backend
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Fiber](https://img.shields.io/badge/fiber-%2300ADD8.svg?style=for-the-badge&logo=gofiber&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![GORM](https://img.shields.io/badge/GORM-blue?style=for-the-badge)

#### Database
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

#### Infrastructure
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

---

## 📂 Project Structure

```text
├── api_gateway/        # Nginx API Gateway configuration
├── backend/            # Go Backend source code
│   ├── cmd/            # Main application entry points
│   └── internal/       # Core business logic, services, and handlers
├── frontend/           # React Frontend source code
│   ├── src/            # Components, pages, and hooks
│   └── public/         # Static assets
└── docker-compose.yaml # Orchestration for the entire stack
```

---

## 🔧 Getting Started

### Prerequisites
-   Docker and Docker Compose
-   Go 1.24+ (for local development)
-   Node.js 20+ (for local development)

### Deployment (Production)

1.  **Clone the project**
2.  **Configure Environment Variables**:
    -   Fill in `backend/.prod.env` with your API keys (Mayar, Google, etc.).
    -   Fill in `frontend/.prod.env` with your frontend-specific keys.
3.  **Launch with Docker Compose**:
    ```bash
    docker-compose up --build -d
    ```
4.  **Access the App**:
    -   Your app will be available at `http://localhost` (or through your Cloudflare Tunnel).

### Local Development

**Backend:**
```bash
cd backend
go run cmd/server/main.go
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
