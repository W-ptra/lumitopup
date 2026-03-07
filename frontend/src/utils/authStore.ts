import { create } from "zustand";
import type { UserResponse } from "../service/authService";
import { authService } from "../service/authService";

type AuthState = {
    user: UserResponse | null;
    isLoading: boolean;
    setUser: (user: UserResponse | null) => void;
    fetchUser: () => Promise<void>;
    login: () => void;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user, isLoading: false }),
    fetchUser: async () => {
        try {
            set({ isLoading: true });
            const user = await authService.getMe();
            set({ user, isLoading: false });
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },
    login: () => {
        window.location.href = authService.getLoginUrl();
    },
    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
        set({ user: null });
        window.location.href = "/";
    },
}));
