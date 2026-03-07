import { apiFetch } from "../utils/api";

export type CreateTransactionRequest = {
    product_id: string;
    payment_method: string;
    game_uid: string;
    server: string;
    email?: string;
};

export type TransactionResponse = {
    id: string;
    game_name: string;
    product_title: string;
    amount: number;
    payment_method: string;
    payment_url: string;
    snap_token: string;
    qr_string?: string;
    status: string;
    expired_at: string;
    created_at: string;
};

export type TransactionDetailResponse = TransactionResponse & {
    game_uid: string;
    server: string;
    email: string;
    failure_reason: string;
    mayar_order_id: string;
};

export const transactionService = {
    create: (data: CreateTransactionRequest) => apiFetch<TransactionResponse>("/transactions", {
        method: "POST",
        body: data,
    }),
    getUserTransactions: () => apiFetch<TransactionResponse[]>("/transactions"),
    getTransactionDetail: (id: string) => apiFetch<TransactionDetailResponse>(`/transactions/${id}`),
};
