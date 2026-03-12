type Product = {
  logo: string;
  title: string;
  link: string;
};

type ProductCardProps = {
  products: Product[];
};

function GameCard({ products }: ProductCardProps) {
  return (
    <>
      {/* Existing game cards */}
      {products.map((product, index) => (
        <a
          key={index}
          href={product.link}
          className="
            group
            flex flex-col
            items-center
            gap-2
            bg-white
            border border-gray-200
            rounded-xl
            p-3 md:p-4
            shadow-sm
            transition
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
            {product.logo ? (
              <img
                src={product.logo}
                alt={product.title}
                className="
                  w-full h-full object-cover
                  group-hover:scale-105
                  transition-transform duration-200
                "
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null; // prevent infinite loop
                  (e.target as HTMLImageElement).src = ""; // Clear src
                  (e.target as HTMLImageElement).parentElement?.classList.add("bg-[#7491F7]");
                  (e.target as HTMLImageElement).style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "text-white font-bold text-3xl uppercase";
                  fallback.innerText = product.title.charAt(0);
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#7491F7] flex items-center justify-center text-white font-bold text-3xl uppercase tracking-wider">
                {product.title.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="text-xs md:text-sm font-semibold text-gray-800 text-center">
            {product.title}
          </h2>
        </a>
      ))}

      {/* Coming Soon Card */}
      <div
        className="
          relative
          flex flex-col
          items-center
          justify-center
          gap-1.5
          rounded-xl
          p-3 md:p-4
          bg-white
          border border-[#7491F7]/30
          shadow-sm
          text-center
        "
      >
        {/* Subtle blue accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#7491F7] rounded-t-xl" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm md:text-base font-semibold text-gray-800">
            More Games Coming
          </span>

          <span className="text-xs md:text-sm text-gray-500">
            Stay tuned 👀
          </span>
        </div>

        {/* Decorative dots */}
        <div className="mt-2 flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7491F7]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7491F7]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7491F7]/20" />
        </div>
      </div>


    </>
  );
}

export default GameCard;
