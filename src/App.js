import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import Header from "./Components/header/header";
import Footer from "./Components/footer/footer";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Header /> },
    { path: "Login", element: <LoginForm /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
