import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import Introducing from "./Pages/Introducing/Introducing";
import CreateFish from "./Pages/CreateFish/CreateFish";
import CreateAquarium from "./Pages/CreateAquarium/CreateAquarium";
import ManageAdmin from "./Pages/ManageAdmin/Manage_Admin";
import AquariumManagement from "./Pages/Manage/Aquarium/AquariumManagement";
import FishManagement from "./Pages/Manage/Fish/FishManagement";
import UpdateAquarium from "./Pages/Manage/UpdateAquarium/UpdateAquarium";
import UpdateFish from "./Pages/Manage/UpdateFish/UpdateFish";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./Pages/ProductDetail/productDetail";
import BlogDetail from "./Pages/BlogDetail/BlogDetail";
import Cart from "./Pages/Cart/cart";
import MainLayout from "./MainLayout";
import Profile from "./Pages/profileDetail/profile";
import PrivateRoute from "./Pages/ManageAdmin/PrivateRoute";
import Order from "./Pages/OrderHistory/order";
import CalcFood from "./Pages/Services/CalcFood/calcFood";
import CalcSalt from "./Pages/Services/CalcSalt/calcSalt";
import Water from "./Pages/Manage/WaterManagement/water";
import AuthGuard from "./Pages/authGuagd";

function App() {
  return (
    <div>
      <AuthGuard />
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/introducing" element={<Introducing />} />
          <Route path="/product" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/createfish" element={<CreateFish />} />
          <Route path="/createaquarium" element={<CreateAquarium />} />
          <Route path="/aquariummanagement" element={<AquariumManagement />} />
          <Route path="/fishmanagement" element={<FishManagement />} />
          <Route path="/updateaquarium/:id" element={<UpdateAquarium />} />
          <Route path="/updatefish/:id" element={<UpdateFish />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orderHistory" element={<Order />} />
          <Route path="/calcFood" element={<CalcFood />} />
          <Route path="/calcSalt" element={<CalcSalt />} />
          <Route path="/water" element={<Water />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="Admin">
              <ManageAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
