import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout";
import GameCard from "../components/GameCard";
import PromoBanner from "../components/PromoBanner";
import { gameService } from "../service/gameService";

function Dashboard() {
  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: gameService.getGames,
  });

  const availableGames = games?.map((g) => ({
    title: g.name,
    link: `/games/${g.id}`,
    logo: g.image,
  })) || [];

  return (
    <MainLayout>
      <PromoBanner />

      <section className="mt-6">
        <h1 className="text-base md:text-lg font-semibold mb-4">
          Game Tersedia
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              gap-3 sm:gap-4 md:gap-6
            "
          >
            <GameCard products={availableGames} />
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Dashboard;
