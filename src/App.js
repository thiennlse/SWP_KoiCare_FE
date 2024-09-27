import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import Fish from "./Pages/CreateFish/CreateFish";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Fish />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
