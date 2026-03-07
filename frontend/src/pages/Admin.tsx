import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout";
import UserCard from "../components/UserCard";
import { 
  Search, Package, 
  ArrowLeft, Loader2, Trash2, 
  ChevronLeft, ChevronRight as ChevronRightIcon, Edit3
} from "lucide-react";
import { gameService } from "../service/gameService";
import type { GameResponse, ProductResponse } from "../service/gameService";
import { productService } from "../service/productService";
import { userService } from "../service/userService";
import { useAuthStore } from "../utils/authStore";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser, isLoading: isAuthLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"games" | "users">("games");
  const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isAuthLoading && (!currentUser || currentUser.role !== "ADMIN")) {
      navigate("/");
    }
  }, [currentUser, isAuthLoading, navigate]);

  // Queries
  const { data: games, isLoading: isGamesLoading } = useQuery({
    queryKey: ["admin", "games"],
    queryFn: gameService.getGames,
    enabled: activeTab === "games",
  });

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: userService.getAllUsers,
    enabled: activeTab === "users",
  });

  const { data: gameDetails, isLoading: isProductsLoading } = useQuery({
    queryKey: ["admin", "game", selectedGame?.id],
    queryFn: () => gameService.getGameProducts(selectedGame!.id),
    enabled: !!selectedGame,
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: any) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "game", selectedGame?.id] });
      setNewTitle(""); setNewPrice("");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "game", selectedGame?.id] });
      setNewTitle(""); setNewPrice(""); setEditingId(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "game", selectedGame?.id] });
    },
  });

  // Handlers
  const handleSaveProduct = () => {
    if (!selectedGame || !newTitle || !newPrice) return;
    
    const payload = {
      game_id: selectedGame.id,
      title: newTitle,
      price: parseInt(newPrice),
    };

    if (editingId) {
      updateProductMutation.mutate({ id: editingId, data: payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  const handleEditProduct = (prod: ProductResponse) => {
    setEditingId(prod.id);
    setNewTitle(prod.title);
    setNewPrice(prod.price.toString());
  };

  if (isAuthLoading) return <MainLayout><div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div></MainLayout>;

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {selectedGame && (
              <button onClick={() => setSelectedGame(null)} className="p-2 hover:bg-indigo-50 text-[#7491F7] rounded-full transition">
                <ArrowLeft size={24}/>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">{selectedGame ? selectedGame.name : "Admin Panel"}</h1>
              <p className="text-gray-500 font-medium text-sm">Kelola katalog produk dan manajemen pengguna</p>
            </div>
          </div>

          {!selectedGame && (
            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200 shadow-inner">
              <button 
                onClick={() => {setActiveTab("games"); setCurrentPage(1);}} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === "games" ? "bg-white text-[#7491F7]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Catalog
              </button>
              <button 
                onClick={() => {setActiveTab("users"); setCurrentPage(1);}} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === "users" ? "bg-white text-[#7491F7]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Users
              </button>
            </div>
          )}
        </header>

        {/* --- VIEW: GAMES LIST --- */}
        {activeTab === "games" && !selectedGame && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isGamesLoading ? (
               [1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-[2rem]" />)
            ) : games?.map((game) => (
              <div 
                key={game.id} 
                className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1" 
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex justify-between items-start mb-6">
                  <img src={game.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt={game.name} />
                  <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-[#7491F7] group-hover:text-white transition-colors">
                    <ChevronRightIcon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">{game.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${game.active ? "bg-green-500" : "bg-red-500"}`} />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{game.active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW: USERS --- */}
        {activeTab === "users" && !selectedGame && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" placeholder="Cari nama atau email pengguna..." value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                className="w-full pl-16 pr-6 py-5 rounded-3xl border-none shadow-sm ring-1 ring-gray-200 focus:ring-4 focus:ring-[#7491F7]/10 transition outline-none bg-white font-bold text-gray-700 placeholder:text-gray-300"
              />
            </div>
            
            {isUsersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[2rem]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUsers.map(u => (
                  <UserCard key={u.id} user={{ 
                    id: u.id, name: u.name, email: u.email, role: u.role as any, 
                    joinedDate: new Date(u.created_at).toLocaleDateString(), image: u.image 
                  }} />
                ))}
              </div>
            )}

            {/* PAGINATION UI */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-8 border-t border-gray-100 pt-10">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)} 
                  className="p-3 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors bg-white shadow-sm disabled:opacity-30"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  Hal <span className="text-[#7491F7]">{currentPage}</span> / {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  className="p-3 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors bg-white shadow-sm disabled:opacity-30"
                >
                  <ChevronRightIcon size={24} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: PRODUCT CRUD --- */}
        {selectedGame && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="font-black text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-[#7491F7]"><Package size={20}/></div>
                {editingId ? "Update Denominasi" : "Tambah Produk Baru"}
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" placeholder="Nama Produk (e.g. 60 Genesis Crystals)" 
                  value={newTitle} onChange={(e) => setNewTitle(e.target.value)} 
                  className="border-gray-200 border rounded-2xl px-5 py-4 flex-1 bg-gray-50 font-bold outline-none focus:ring-4 focus:ring-[#7491F7]/10" 
                />
                <input 
                  type="number" placeholder="Harga" 
                  value={newPrice} onChange={(e) => setNewPrice(e.target.value)} 
                  className="border-gray-200 border rounded-2xl px-5 py-4 md:w-56 bg-gray-50 font-bold outline-none focus:ring-4 focus:ring-[#7491F7]/10" 
                />
                <button 
                  onClick={handleSaveProduct} 
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  className="bg-[#7491F7] hover:bg-[#5f7ee6] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition disabled:opacity-50"
                >
                  {(createProductMutation.isPending || updateProductMutation.isPending) ? "Saving..." : (editingId ? "Update" : "Simpan")}
                </button>
                {editingId && (
                  <button onClick={() => {setEditingId(null); setNewTitle(""); setNewPrice("");}} className="text-gray-400 font-bold px-4 hover:text-gray-600 transition">Batal</button>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden border-b-0">
               <div className="p-8 border-b border-gray-50">
                  <h3 className="font-black text-gray-800 tracking-tight">Daftar Produk {selectedGame.name}</h3>
               </div>
              {isProductsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold">Loading products...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="p-6">Produk</th>
                        <th className="p-6">Harga</th>
                        <th className="p-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {gameDetails?.products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-indigo-50/30 transition group">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <img src={prod.image || selectedGame.image} className="w-10 h-10 rounded-lg object-contain" alt={prod.title} />
                              <span className="font-bold text-gray-800">{prod.title}</span>
                            </div>
                          </td>
                          <td className="p-6 text-gray-600 font-black">Rp {prod.price.toLocaleString("id-ID")}</td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => handleEditProduct(prod)} 
                                className="p-2 text-[#7491F7] hover:bg-white hover:shadow-sm rounded-xl transition"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => { if(confirm("Hapus produk ini?")) deleteProductMutation.mutate(prod.id) }} 
                                className="p-2 text-red-400 hover:bg-white hover:shadow-sm rounded-xl transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Admin;