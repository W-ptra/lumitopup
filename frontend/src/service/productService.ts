import { apiFetch } from "../utils/api";
import type { ProductResponse } from "./gameService";

export type CreateProductRequest = {
    game_id: string;
    title: string;
    price: number;
    original_price?: number;
    image?: string;
};

export type UpdateProductRequest = Partial<CreateProductRequest> & {
    active?: boolean;
};

export const productService = {
    createProduct: (data: CreateProductRequest) => apiFetch<ProductResponse>("/admin/products", {
        method: "POST",
        body: data,
    }),
    updateProduct: (id: string, data: UpdateProductRequest) => apiFetch<ProductResponse>(`/admin/products/${id}`, {
        method: "PUT",
        body: data,
    }),
    deleteProduct: (id: string) => apiFetch<void>(`/admin/products/${id}`, {
        method: "DELETE",
    }),
};
