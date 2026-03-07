import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout";
import { Check, X, Clock, RotateCw, Headphones, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transactionService } from "../service/transactionService";
import QRCode from "react-qr-code";

function TransactionDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: transaction, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["transaction", id],
        queryFn: () => transactionService.getTransactionDetail(id!),
        enabled: !!id,
        refetchInterval: (query) => {
            // Auto refetch every 10s if pending
            return query.state.data?.status === "PENDING" ? 10000 : false;
        }
    });

    const statusConfig = {
        SUCCESS: {
            icon: <Check className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />,
            color: "bg-green-500",
            title: "Pembayaran Berhasil",
            iconAnim: { scale: [0, 1.2, 1], rotate: [0, 10, 0] },
        },
        PENDING: {
            icon: <Clock className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />,
            color: "bg-amber-400",
            title: "Menunggu Pembayaran",
            iconAnim: { rotate: 360 },
        },
        FAILED: {
            icon: <X className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />,
            color: "bg-red-500",
            title: "Pembayaran Gagal",
            iconAnim: { x: [-4, 4, -4, 4, 0] },
        },
    };

    const status = (transaction?.status as "SUCCESS" | "PENDING" | "FAILED") || "PENDING";

    if (isLoading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#7491F7]/20 border-t-[#7491F7] rounded-full animate-spin" />
                </div>
            </MainLayout>
        );
    }

    if (!transaction) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <h2 className="text-xl font-bold text-gray-800">Transaksi tidak ditemukan</h2>
                    <button onClick={() => navigate("/")} className="mt-4 text-[#7491F7] font-bold">Kembali ke Home</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100"
                >
                    <div className="pt-10 pb-6 flex flex-col items-center">
                        <motion.div
                            key={status}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={`${statusConfig[status].color} p-4 md:p-5 rounded-full mb-4 shadow-lg shadow-gray-200`}
                        >
                            <motion.div
                                animate={statusConfig[status].iconAnim}
                                transition={
                                    status === "PENDING"
                                        ? { repeat: Infinity, duration: 3, ease: "linear" }
                                        : { duration: 0.5 }
                                }
                            >
                                {statusConfig[status].icon}
                            </motion.div>
                        </motion.div>

                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{statusConfig[status].title}</p>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2 tracking-tight">
                            Rp{transaction.amount.toLocaleString("id-ID")}
                        </h1>
                    </div>

                    <div className="px-6 md:px-10 pb-8">
                        <div className="space-y-4 py-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-start gap-4">
                                <span className="text-gray-400 text-xs md:text-sm font-medium">Tanggal</span>
                                <span className="text-gray-700 font-bold text-xs md:text-sm text-right">
                                    {new Date(transaction.created_at).toLocaleString("id-ID", {
                                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-400 text-xs md:text-sm font-medium">ID Transaksi</span>
                                <span className="text-gray-700 font-mono text-[10px] md:text-xs font-bold bg-gray-50 px-2 py-1 rounded">{transaction.id}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-400 text-xs md:text-sm font-medium">Mayar Order ID</span>
                                <span className="text-indigo-600 font-mono text-[10px] md:text-xs font-bold bg-indigo-50 px-2 py-1 rounded">{transaction.mayar_order_id}</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <span className="text-gray-400 text-xs md:text-sm font-medium">Item & Game</span>
                                <div className="text-right">
                                    <p className="text-gray-800 font-bold text-xs md:text-sm leading-tight">{transaction.product_title}</p>
                                    <p className="text-gray-400 text-[10px] md:text-xs font-medium uppercase tracking-widest">{transaction.game_name}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-400 text-xs md:text-sm font-medium">User ID / Server</span>
                                <span className="text-gray-700 font-bold text-xs md:text-sm uppercase">{transaction.game_uid} / {transaction.server}</span>
                            </div>

                            <AnimatePresence mode="wait">
                                {status === "FAILED" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 p-4 rounded-2xl border border-red-100 mt-2"
                                    >
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pesan Error</p>
                                        <p className="text-red-700 text-xs md:text-sm font-medium leading-relaxed">{transaction.failure_reason || "Gagal diproses oleh sistem pembayaran."}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {status === "PENDING" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-2">
                                {transaction.qr_string ? (
                                    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4 flex flex-col items-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Scan QRIS Untuk Membayar</p>
                                        <div className="p-4 bg-white border-4 border-[#7491F7]/5 rounded-3xl">
                                            <QRCode value={transaction.qr_string} size={200} />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[10px] text-gray-500 font-medium leading-tight">
                                                Gunakan aplikasi e-wallet apa pun <br />
                                                (Gopay, OVO, DANA, ShopeePay, dll)
                                            </p>
                                        </div>

                                        {transaction.payment_url && (
                                            <div className="w-full pt-4 border-t border-gray-100">
                                                <p className="text-[9px] text-indigo-400 font-bold uppercase text-center mb-2 tracking-widest">Simulator URL (Copy This)</p>
                                                <div className="flex gap-2">
                                                    <input 
                                                        readOnly 
                                                        value={transaction.payment_url} 
                                                        className="flex-1 text-[10px] bg-gray-50 p-2 rounded border border-gray-200 text-gray-500 font-mono truncate"
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(transaction.payment_url);
                                                            alert("Link disalin! Paste ke simulator Mayar.");
                                                        }}
                                                        className="bg-indigo-500 text-white text-[10px] px-3 rounded font-bold hover:bg-indigo-600 transition"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3">
                                        <p className="text-xs text-indigo-800 font-medium text-center">Silakan selesaikan pembayaran melalui portal Mayar:</p>
                                        <button
                                            onClick={() => {
                                                window.location.href = transaction.payment_url;
                                            }}
                                            className="flex items-center justify-center w-full gap-2 bg-[#7491F7] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:brightness-110 transition cursor-pointer"
                                        >
                                            Buka Portal Pembayaran <ExternalLink size={16} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="flex items-center justify-center w-full gap-2 text-[#7491F7] font-bold text-xs md:text-sm hover:opacity-70 transition group disabled:opacity-50 py-2"
                                >
                                    <RotateCw size={14} className={`${isFetching ? "animate-spin" : ""}`} />
                                    {isFetching ? "Memperbarui..." : "Cek Status Berbayar"}
                                </button>
                            </motion.div>
                        )}

                        <div className="mt-8 space-y-3">
                            <button
                                className="w-full py-4 px-6 bg-[#7491F7] text-white rounded-[1.25rem] font-bold shadow-xl shadow-indigo-100 hover:brightness-110 transition flex items-center justify-center gap-2 text-sm md:text-base tracking-tight"
                                onClick={() => navigate("/")}
                            >
                                Kembali Berbelanja
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50/80 p-5 border-t border-gray-100 flex items-center justify-center gap-4">
                        <div className="p-2.5 bg-white rounded-full shadow-sm shrink-0">
                            <Headphones size={16} className="text-gray-400" />
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight font-medium">
                            Ada kendala? <br />
                            <a href="#" className="text-[#7491F7] font-bold hover:underline">Hubungi Customer Support</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}

export default TransactionDetail;