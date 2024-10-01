import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import Fish from "./Pages/CreateFish/CreateFish";
import { Routes, Route } from "react-router-dom";
import Purchase from "./Pages/PurchasePage/purchase";
import Cart from "./Pages/Cart/Cart";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product" element={<HomePage />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
