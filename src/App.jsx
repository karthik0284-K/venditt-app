import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import LocateVending from "./pages/LocateVending";
// import RecentHistory from "./pages/RecentHistory";
import ProfilePage from "./pages/ProfilePage";
import Location from "./pages/Location";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";
import AdminProducts from "./pages/AdminProducts";
import AdminCategory from "./pages/AdminCategory";
import Orders from "./pages/Orders";
import "./App.css";

function App() {
  return (
    <CartProvider>
      {" "}
      {/* ✅ Wrap CartProvider correctly */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/locate" element={<LocateVending />} />
        {/* <Route path="/history" element={<RecentHistory />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/location" element={<Location />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/adminProducts" element={<AdminProducts />} />
        <Route path="/adminCategory" element={<AdminCategory />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <BottomNav />
    </CartProvider>
  );
}

export default App;
