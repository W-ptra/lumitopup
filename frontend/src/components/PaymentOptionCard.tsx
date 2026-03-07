type PaymentMethod = {
  id: string;
  name: string;
  logo: string;
  price: number;
};

type Props = {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (id: string) => void;
};

export default function PaymentOptionCard({
  method,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      onClick={() => onSelect(method.id)}
      className={`flex flex-col items-center gap-2 border rounded-xl p-3 transition
        ${selected
          ? "border-[#7491F7] ring-2 ring-[#7491F7]/20"
          : "border-gray-200 hover:shadow"}
      `}
    >
      <img src={method.logo} className="h-6 object-contain" />
      {method.price > 0 && (
        <span className="text-xs font-semibold text-[#7491F7]">
          Rp {method.price.toLocaleString("id-ID")}
        </span>
      )}
    </button>
  );
}
