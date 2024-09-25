import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import Fish from "./Pages/CreateFish/CreateFish";
function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Fish /> },
    { path: "Login", element: <LoginForm /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
