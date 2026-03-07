import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Product from "./pages/Product";
import Transaction from "./pages/Transaction";
import TransactionDetail from "./pages/TransactionDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/games/:id" element={<Product />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/transaction/:id" element={<TransactionDetail />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;