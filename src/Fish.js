import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginForm from "./Pages/Login/Login";
import HomePage from "./Pages/HomePage/HomePage";
import CreateFish from "./Pages/CreateFish/CreateFish";
function Fish() {
  const router = createBrowserRouter([
    { path: "/", element: <CreateFish /> },
    { path: "Login", element: <LoginForm /> },
  ]);
  return <RouterProvider router={router} />;
}

export default Fish;
