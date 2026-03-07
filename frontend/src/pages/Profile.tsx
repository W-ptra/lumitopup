import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { LogOut, Calendar, Mail, Loader2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../utils/authStore";

function Profile() {
  const { user, logout, isLoading } = useAuthStore();
  const [randomMessage, setRandomMessage] = useState("");

  const messages = [
    "Terima kasih telah mempercayakan LumiTopUp untuk kebutuhan gaming-mu!",
    "Senang melihatmu kembali. Selamat bermain, Traveler!",
    "Dukunganmu sangat berarti bagi LumiTopUp. Terima kasih!",
    "LumiTopUp: Tempat terbaik untuk top-up digital instan. Nikmati layanan kami!",
    "Selamat datang di profil-mu! Terima kasih telah menjadi pelanggan setia LumiTopUp."
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-[#7491F7]" size={40} />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="bg-amber-50 text-amber-600 p-6 rounded-3xl border border-amber-100 flex flex-col items-center max-w-sm">
            <LogOut size={48} className="mb-4" />
            <h2 className="text-xl font-black mb-2 tracking-tight">Belum Login</h2>
            <p className="text-sm font-medium mb-6">Silakan login menggunakan akun Google untuk mengakses profil dan riwayat transaksi.</p>
            <button
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
              className="bg-[#7491F7] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition hover:brightness-110 active:scale-95"
            >
              Login with Google
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Header Section */}
          <div className="h-32 bg-[#7491F7] relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute bottom-[-50%] left-[-5%] w-32 h-32 bg-white/5 rounded-full" />

            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 p-2 bg-white rounded-[2rem] shadow-xl">
              <img
                src={user.image}
                alt="Profile"
                className="w-28 h-28 rounded-[1.75rem] object-cover bg-gray-50 border border-gray-100"
              />
            </div>
          </div>

          {/* Body Section */}
          <div className="pt-20 pb-10 px-8 text-center">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{user.name}</h2>

            {/* Role Badge */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-8 bg-indigo-50 w-fit mx-auto px-4 py-1.5 rounded-full border border-indigo-100">
              {user.role === "ADMIN" ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Store Administrator</span>
                </>
              ) : (
                <>
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="G" className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Verified Customer</span>
                </>
              )}
            </div>

            {/* Randomized Welcome Message */}
            <div className="bg-indigo-50/50 p-5 rounded-3xl mb-8 border border-dashed border-indigo-100">
              <p className="text-sm text-[#7491F7] font-bold italic leading-relaxed leading-6">
                "{randomMessage}"
              </p>
            </div>

            {/* Data Rows */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7491F7] group-hover:bg-indigo-50 transition-colors">
                  <Mail size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Alamat Email</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7491F7] group-hover:bg-indigo-50 transition-colors">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Terdaftar Sejak</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(user.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="mt-10 w-full py-4 border-2 border-red-50 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-red-50 transition active:scale-95"
            >
              <LogOut size={18} />
              Keluar dari Akun
            </button>
          </div>

          {/* Bottom Branding */}
          <div className="bg-gray-50/50 p-6 flex flex-col items-center border-t border-gray-50">
            <img src="/lumitopup-logo.png" className="w-12 grayscale opacity-20 mb-2" alt="Logo" />
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">LumiTopUp Customer ID: {user.id.substring(0, 8)}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;