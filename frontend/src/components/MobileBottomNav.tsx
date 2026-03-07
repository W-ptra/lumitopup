import { Home, ReceiptText, ShieldUser, SquareUser } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function MobileBottomNav() {
    const location = useLocation();

    const navItems = [
        { label: "Home", path: "/", icon: Home },
        { label: "Transaction", path: "/transaction", icon: ReceiptText },
        { label: "Admin", path: "/admin", icon: ShieldUser },
        { label: "Profile", path: "/profile", icon: SquareUser },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t md:hidden">
            <div className="flex h-full justify-around items-center">
                {navItems.map(({ label, path, icon: Icon }) => {
                    const isActive = location.pathname === path;

                    return (
                        <a
                            key={label}
                            href={path}
                            className={`
            flex flex-col items-center justify-center w-full h-full text-xs
            ${isActive
                                    ? "text-[#7491F7] border-b-2 border-[#7491F7]"
                                    : "text-gray-500"
                                }
          `}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            {label}
                        </a>
                    );
                })}
            </div>
        </nav>

    );
}
