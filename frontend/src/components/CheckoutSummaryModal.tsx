import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ProductResponse } from "../service/gameService";
import { transactionService } from "../service/transactionService";

type Props = {
  open: boolean;
  onClose: () => void;
  product: ProductResponse;
  uuid: string;
  server: string;
  email?: string;
  onConfirm: () => void;
};

export default function CheckoutSummaryModal({
  open,
  onClose,
  product,
  uuid,
  server,
  email,
}: Props) {
  if (!open) return null;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProcessOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await transactionService.create({
        product_id: product.id,
        payment_method: "MAYAR",
        game_uid: uuid,
        server: server,
        email: email || undefined,
      });

      // Redirect user directly to Mayar Payment URL
      if (res.payment_url) {
        window.location.href = res.payment_url;
      } else {
        // Fallback if no payment url
        navigate(`/transaction/${res.id}`);
      }

    } catch (error: any) {
      alert(error.message || "Gagal membuat transaksi");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">

        {/* TITLE */}
        <h2 className="text-xl font-bold text-[#7491F7]">
          Konfirmasi Pesanan
        </h2>

        {/* SUMMARY */}
        <div className="text-sm space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Item Top-Up</span>
            <span className="font-bold text-right text-gray-800">{product.title}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">User ID (UID)</span>
            <span className="font-bold text-right text-gray-800">{uuid}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Server</span>
            <span className="font-bold capitalize text-right text-gray-800">
              {server}
            </span>
          </div>

          {/* EMAIL (ONLY IF EXISTS) */}
          {email && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-right break-all max-w-[60%] text-gray-800">
                {email}
              </span>
            </div>
          )}

          <hr className="border-dashed" />

          <div className="flex justify-between text-base font-bold">
            <span>Total Bayar</span>
            <span className="text-[#7491F7]">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* WARNING */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 leading-relaxed shadow-sm">
          <p className="font-bold mb-1 flex items-center gap-1">
            ⚠️ PERINGATAN!
          </p>
          <p>
            Pastikan data di atas sudah valid. Kesalahan input data yang mengakibatkan item gagal terkirim atau salah sasaran <span className="underline decoration-amber-500/50 font-bold">BUKAN tanggung jawab kami</span>.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-sm font-bold text-gray-600 transition"
          >
            Batal
          </button>

          <button
            disabled={isSubmitting}
            onClick={handleProcessOrder}
            className="flex-1 bg-[#7491F7] hover:bg-[#5f7ee6] text-white rounded-xl py-3 text-sm font-bold transition shadow-lg shadow-indigo-100 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Lanjut Pembayaran"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
