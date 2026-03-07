import { render, screen } from "@testing-library/react";
import GameCard from "../GameCard";
import { describe, it, expect } from "vitest";

describe("GameCard", () => {
    const products = [
        { logo: "logo1.png", title: "Game 1", link: "/game-1" },
        { logo: "logo2.png", title: "Game 2", link: "/game-2" },
    ];

    it("renders the list of games", () => {
        render(<GameCard products={products} />);
        expect(screen.getByText("Game 1")).toBeInTheDocument();
        expect(screen.getByText("Game 2")).toBeInTheDocument();
        expect(screen.getByText("More Games Coming")).toBeInTheDocument();
    });

    it("renders the correct links for games", () => {
        render(<GameCard products={products} />);
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "/game-1");
        expect(links[1]).toHaveAttribute("href", "/game-2");
    });
});
