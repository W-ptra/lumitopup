import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout";
import ProductOptionCard from "../components/ProductOptionCard";
import CheckoutSummaryModal from "../components/CheckoutSummaryModal";
import { gameService } from "../service/gameService";
import type { ProductResponse } from "../service/gameService";
import { useAuthStore } from "../utils/authStore";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { user, login } = useAuthStore();

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: () => gameService.getGameProducts(id!),
    enabled: !!id,
  });

  /* ---------------- STATE ---------------- */
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [uuid, setUuid] = useState("");
  const [server, setServer] = useState("");
  const [email, setEmail] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const disabled = !selectedProduct || !uuid || !server;

  const handleOpenSummary = () => {
    if (!user) {
      if (confirm("Silakan login terlebih dahulu untuk melakukan transaksi.")) {
        login();
      }
      return;
    }
    setShowSummary(true);
  };

  /* lock scroll on modal */
  useEffect(() => {
    document.body.style.overflow = showSummary ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSummary]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl" />
            <div className="w-48 h-8 bg-gray-200 rounded" />
          </div>
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 pb-32 md:pb-0">

        {/* HEADER */}
        {game && (
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-xl border bg-[#7491F7] flex items-center justify-center text-white font-bold text-2xl md:text-4xl uppercase overflow-hidden">
                {game.name.charAt(0)}
                {game.image && (
                    <img 
                        src={game.image} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt={game.name} 
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                )}
            </div>
            <h1 className="text-lg md:text-2xl font-semibold">{game.name}</h1>
          </div>
        )}

        {/* PRODUCTS */}
        <section>
          <h2 className="font-semibold mb-4">Pilih Produk</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {game?.products.map(p => (
              <ProductOptionCard
                key={p.id}
                product={p}
                selected={selectedProduct?.id === p.id}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="bg-white border rounded-2xl p-4 space-y-3">
          <h2 className="font-semibold">Data Akun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#7491F7]/20 border-gray-200" 
              placeholder="Masukkan UID" 
              value={uuid} 
              onChange={e => setUuid(e.target.value)} 
            />
            <select 
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#7491F7]/20 border-gray-200" 
              value={server} 
              onChange={e => setServer(e.target.value)}
            >
              <option value="">Pilih Server</option>
              <option value="asia">Asia</option>
              <option value="america">America</option>
              <option value="europe">Europe</option>
              <option value="tw_hk_mo">TW / HK / MO</option>
            </select>
          </div>
        </section>

        {/* EMAIL */}
        <section className="bg-white border rounded-2xl p-4 space-y-3">
          <h2 className="font-semibold">Email</h2>
          <input 
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#7491F7]/20 border-gray-200" 
            placeholder="Masukkan Email (Opsional)" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <p className="text-xs text-gray-400 font-medium italic">Invoice akan dikirim ke email ini jika diisi.</p>
        </section>



        {/* DESKTOP BUY BAR — NORMAL FLOW */}
        <div className="hidden md:block bg-white border rounded-2xl p-4 sticky bottom-4 shadow-lg border-[#7491F7]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Bayar</p>
              <p className="text-2xl font-bold text-[#7491F7]">
                {selectedProduct
                  ? `Rp ${selectedProduct.price.toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>
            <button
              disabled={disabled}
              onClick={handleOpenSummary}
              className="bg-[#7491F7] hover:bg-[#5f7ee6] text-white px-10 py-3 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BUY BAR ONLY */}
      <div className="md:hidden fixed left-0 right-0 bottom-16 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 font-medium">Total Pembayaran</p>
            <p className="font-bold text-[#7491F7]">
              {selectedProduct
                ? `Rp ${selectedProduct.price.toLocaleString("id-ID")}`
                : "-"}
            </p>
          </div>
          <button
            disabled={disabled}
            onClick={handleOpenSummary}
            className="bg-[#7491F7] text-white px-8 py-2.5 rounded-xl font-bold transition disabled:opacity-50 text-sm shadow-md shadow-indigo-100"
          >
            Bayar
          </button>
        </div>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <CheckoutSummaryModal
          open={showSummary}
          onClose={() => setShowSummary(false)}
          product={selectedProduct}
          uuid={uuid}
          server={server}
          email={email}
          onConfirm={() => setShowSummary(false)}
        />
      )}
    </MainLayout>
  );
}
