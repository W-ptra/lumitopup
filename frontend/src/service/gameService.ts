import { apiFetch } from "../utils/api";

export type GameResponse = {
    id: string;
    name: string;
    image: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export type ProductResponse = {
    id: string;
    game_id: string;
    title: string;
    price: number;
    original_price?: number;
    image: string;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export type Charge = {
    type: "FIXED" | "PERCENTAGE";
    value: number;
};

export type PaymentMethod = {
    id: string;
    name: string;
    logo: string;
    charge: Charge;
};

export type GameWithProductsResponse = {
    id: string;
    name: string;
    image: string;
    products: ProductResponse[];
    payment_methods: PaymentMethod[];
};

export type CreateGameRequest = {
    name: string;
    image?: string;
};

export type UpdateGameRequest = Partial<CreateGameRequest> & {
    active?: boolean;
};

export const gameService = {
    getGames: () => apiFetch<GameResponse[]>("/games"),
    getGameProducts: (id: string) => apiFetch<GameWithProductsResponse>(`/games/${id}/products`),

    // Admin Methods
    createGame: (data: CreateGameRequest) => apiFetch<GameResponse>("/admin/games", {
        method: "POST",
        body: data,
    }),
    updateGame: (id: string, data: UpdateGameRequest) => apiFetch<GameResponse>(`/admin/games/${id}`, {
        method: "PUT",
        body: data,
    }),
    deleteGame: (id: string) => apiFetch<void>(`/admin/games/${id}`, {
        method: "DELETE",
    }),
};
