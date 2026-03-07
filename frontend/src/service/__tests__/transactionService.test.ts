import { describe, it, expect, vi } from "vitest";
import { transactionService } from "../transactionService";
import { apiFetch } from "../../utils/api";

// Mock the apiFetch utility
vi.mock("../../utils/api", () => ({
    apiFetch: vi.fn(),
}));

describe("transactionService", () => {
    it("should call apiFetch with correct parameters on create", async () => {
        const mockData = {
            product_id: "prod-1",
            payment_method: "QRIS",
            game_uid: "user-123",
            server: "asia",
            email: "test@example.com",
        };

        const mockResponse = { id: "tx-123", status: "PENDING" };
        (apiFetch as any).mockResolvedValue(mockResponse);

        const result = await transactionService.create(mockData);

        expect(apiFetch).toHaveBeenCalledWith("/transactions", {
            method: "POST",
            body: mockData,
        });
        expect(result).toEqual(mockResponse);
    });

    it("should call apiFetch on getTransactionDetail", async () => {
        const mockId = "tx-123";
        const mockResponse = { id: mockId, status: "SUCCESS" };
        (apiFetch as any).mockResolvedValue(mockResponse);

        const result = await transactionService.getTransactionDetail(mockId);

        expect(apiFetch).toHaveBeenCalledWith(`/transactions/${mockId}`);
        expect(result).toEqual(mockResponse);
    });
});
