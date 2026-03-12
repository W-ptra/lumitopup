import { ReceiptText, Home, ShieldUser, LogOut, LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";

export default function VerticalNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, logout, isLoading } = useAuthStore();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Transaction", path: "/transaction", icon: ReceiptText },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ label: "Admin", path: "/admin", icon: ShieldUser });
  }

  return (
    <aside
      className="
        fixed left-0 top-0
        h-screen w-28
        bg-white border-r
        flex flex-col
        z-40
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center">
        <img 
          src="/lummy-topup-logo.png" 
          className="w-14 h-10" 
          alt="LumiTopUp Logo" 
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLElement).parentElement;
            if (parent) {
              const div = document.createElement('div');
              div.className = "w-10 h-10 bg-[#7491F7] rounded-xl flex items-center justify-center text-white font-bold text-xl";
              div.innerText = "L";
              parent.appendChild(div);
            }
          }}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-0.5 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`
                w-full flex flex-col items-center gap-1 py-3 transition
                ${isActive
                  ? "text-[#7491F7] border-l-4 border-[#7491F7]"
                  : "text-gray-600 hover:text-[#7491F7] hover:border-[#7491F7] hover:border-l-4"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile/AuthSection */}
      <div className="px-2 pb-2">
        {!isLoading && user ? (
          <>
            <div
              className="flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-[#7491F7] hover:border-[#7491F7] hover:border-l-4 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="relative w-8 h-8 rounded-full border bg-[#7491F7] flex items-center justify-center text-white font-bold text-sm uppercase overflow-hidden">
                {user.name ? user.name.charAt(0) : "?"}
                {user.image && (
                  <img 
                    src={user.image} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt={user.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
              <span className="text-[10px] text-center truncate w-full px-1">{user.name}</span>
            </div>
            {/* Logout */}
            <div className="mt-2">
              <button
                onClick={logout}
                className="w-full py-3 flex flex-col items-center gap-1 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          </>
        ) : !isLoading ? (
          <button
            onClick={login}
            className="w-full py-4 flex flex-col items-center gap-1 text-[#7491F7] hover:bg-indigo-50 rounded-xl transition font-medium"
          >
            <LogIn className="w-6 h-6" />
            <span className="text-xs">Login</span>
          </button>
        ) : (
          <div className="animate-pulse flex flex-col items-center gap-2 py-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-12 h-2 bg-gray-200 rounded" />
          </div>
        )}
      </div>
    </aside>
  );
}
