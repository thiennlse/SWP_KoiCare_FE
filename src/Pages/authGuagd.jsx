import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AuthGuagd() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.clear();
          toast.warn("Session expired. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);
  return <div></div>;
}

export default AuthGuagd;
