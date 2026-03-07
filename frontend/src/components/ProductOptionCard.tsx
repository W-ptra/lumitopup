import type { ProductResponse } from "../service/gameService";

type ProductOptionCardProps = {
  product: ProductResponse;
  selected: boolean;
  onSelect: (product: ProductResponse) => void;
};

function ProductOptionCard({
  product,
  selected,
  onSelect,
}: ProductOptionCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className={`
        text-left
        rounded-xl
        border
        bg-white
        p-3 md:p-4
        transition
        ${selected
          ? "border-[#7491F7] ring-2 ring-[#7491F7]/20"
          : "border-gray-200 hover:shadow"
        }
      `}
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-20 md:h-28 object-contain mb-1"
      />

      <div className="text-xs md:text-sm font-medium line-clamp-2 min-h-[2.5rem]">
        {product.title}
      </div>

      <div className="mt-1">
        <div className="text-[#7491F7] text-sm md:text-base font-semibold">
          Rp {product.price.toLocaleString("id-ID")}
        </div>

        {product.original_price && (
          <div className="text-[11px] md:text-xs text-gray-400 line-through">
            Rp {product.original_price.toLocaleString("id-ID")}
          </div>
        )}
      </div>
    </button>
  );
}

export default ProductOptionCard;
