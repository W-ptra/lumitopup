import { useEffect, type ReactNode } from "react";
import VerticalNavbar from "../components/VerticalNavbar";
import MobileBottomNav from "../components/MobileBottomNav";
import Footer from "../components/Footer";
import { useAuthStore } from "../utils/authStore";

type AppLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: AppLayoutProps) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <VerticalNavbar />
      </div>

      {/* Page column */}
      <div
        className="
          flex flex-col
          min-h-screen
          md:ml-28
          pb-16 md:pb-0
        "
      >
        {/* CONTENT */}
        <main className="flex-1 px-4 md:px-10 py-4">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
