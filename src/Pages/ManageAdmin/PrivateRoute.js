import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const [storedRole, setStoredRole] = useState(null);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    console.log("PrivateRoute - Fetched Role:", role);
    setStoredRole(role);
  }, []);

  if (storedRole === null) {
    return <div>Loading...</div>;
  }

  if (storedRole !== allowedRole) {
    console.log(
      `Unauthorized - Redirecting to /. Expected: ${allowedRole}, Got: ${storedRole}`
    );
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
