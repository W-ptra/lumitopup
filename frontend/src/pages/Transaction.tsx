import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout";
import { ChevronRight as ChevronRightIcon, ChevronLeft, ReceiptText } from "lucide-react";
import { transactionService } from "../service/transactionService";

function Transaction() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionService.getUserTransactions,
  });

  const totalPages = transactions ? Math.ceil(transactions.length / itemsPerPage) : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const statusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "text-green-600 bg-green-50 border-green-200";
      case "PENDING": return "text-amber-600 bg-amber-50 border-amber-200";
      case "FAILED": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <ReceiptText className="w-6 h-6 text-[#7491F7]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <ReceiptText size={40} />
            </div>
            <p className="text-gray-500 font-medium">Belum ada transaksi</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-[#7491F7] text-white rounded-lg font-bold text-sm"
            >
              Cari Game
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW */}
            <div className="block md:hidden space-y-4">
              {currentItems.map((trx) => (
                <div
                  key={trx.id}
                  onClick={() => navigate(`/transaction/${trx.id}`)}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl active:bg-gray-50 transition drop-shadow-sm bg-white"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 font-mono">{trx.id.substring(0, 8)}...</span>
                      <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${statusColor(trx.status)}`}>{trx.status}</span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{trx.game_name}</p>
                    <p className="text-[#7491F7] font-bold text-sm">Rp {trx.amount.toLocaleString("id-ID")}</p>
                  </div>
                  <ChevronRightIcon size={20} className="text-gray-300" />
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-2">ID</th>
                    <th className="py-4 px-2">Game & Produk</th>
                    <th className="py-4 px-2">Total</th>
                    <th className="py-4 px-2 text-center">Metode</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2">Tanggal</th>
                    <th className="py-4 px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.map((trx) => (
                    <tr
                      key={trx.id}
                      className="group hover:bg-indigo-50/30 cursor-pointer transition"
                      onClick={() => navigate(`/transaction/${trx.id}`)}
                    >
                      <td className="py-5 px-2 font-mono text-xs text-gray-400">{trx.id.substring(0, 8)}</td>
                      <td className="py-5 px-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{trx.game_name}</span>
                          <span className="text-xs text-gray-500">{trx.product_title}</span>
                        </div>
                      </td>
                      <td className="py-5 px-2 font-bold text-gray-800">Rp {trx.amount.toLocaleString("id-ID")}</td>
                      <td className="py-5 px-2 text-center">
                        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">{trx.payment_method}</span>
                      </td>
                      <td className="py-5 px-2">
                        <span className={`px-3 py-1 border rounded-full text-[10px] font-bold tracking-tight ${statusColor(trx.status)}`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-5 px-2 text-gray-500 text-xs">
                        {new Date(trx.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-5 px-2 text-right">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-white group-hover:shadow-sm transition">
                          <ChevronRightIcon size={18} className="text-gray-300 group-hover:text-[#7491F7]" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-6 border-t border-gray-100 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center justify-center bg-white disabled:opacity-30"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-[#7491F7] rounded-lg font-bold text-sm">
                    {currentPage}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">dari {totalPages}</span>
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center justify-center bg-white disabled:opacity-30"
                >
                  <ChevronRightIcon size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Transaction;