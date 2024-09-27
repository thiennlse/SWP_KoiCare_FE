import logo from "./logo.svg";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <LoginForm /> },
    { path: "Login", element: <LoginForm /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
