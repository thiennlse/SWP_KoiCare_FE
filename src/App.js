import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import CreateFish from "./Pages/CreateFish/CreateFish";
import CreateAquarium from "./Pages/CreateAquarium/CreateAquarium";
import ManageAdmin from "./Pages/ManageAdmin/Manage_Admin";
import AquariumManagement from "./Pages/Manage/Aquarium/AquariumManagement";
import FishManagement from "./Pages/Manage/Fish/FishManagement";
import { Routes, Route } from "react-router-dom";
import Purchase from "./Pages/PurchasePage/purchase";
import Cart from "./Pages/Cart/cart";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product" element={<HomePage />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/createfish" element={<CreateFish />} />
        <Route path="/createaquarium" element={<CreateAquarium />} />
        <Route path="/admin" element={<ManageAdmin />} />
        <Route path="/aquariummanagement" element={<AquariumManagement />} />
        <Route path="/fishmanagement" element={<FishManagement />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
