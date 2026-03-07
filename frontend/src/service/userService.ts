import { apiFetch } from "../utils/api";
import type { UserResponse } from "./authService";

export const userService = {
    getAllUsers: () => apiFetch<UserResponse[]>("/admin/users"),
};
