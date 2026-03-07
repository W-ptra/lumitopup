import { apiFetch } from "../utils/api";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  created_at: string;
};

export const authService = {
  getLoginUrl: () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Security: We redirect to the backend's /auth/google endpoint
    // which generates a secure state cookie to prevent OAuth CSRF attacks.
    return `${apiUrl}/auth/google`;
  },
  getMe: () => apiFetch<UserResponse>("/users/me"),
  logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),
};
