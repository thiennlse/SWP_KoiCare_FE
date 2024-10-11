import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import CreateFish from "./Pages/CreateFish/CreateFish";
import CreatePool from "./Pages/CreatePool/CreatePool";
import ManageAdmin from "./Pages/ManageAdmin/Manage_Admin";
import { Routes, Route } from "react-router-dom";
import Purchase from "./Pages/PurchasePage/purchase";
import Cart from "./Pages/Cart/cart";
import MainLayout from "./MainLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product" element={<HomePage />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/createfish" element={<CreateFish />} />
          <Route path="/createpool" element={<CreatePool />} />
          <Route path="/admin" element={<ManageAdmin />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
