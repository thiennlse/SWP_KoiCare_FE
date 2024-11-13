import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [storedRole, setStoredRole] = useState(null);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    console.log("PrivateRoute - Fetched Role:", role);
    setStoredRole(role);
  }, []);

  if (storedRole === null) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(storedRole)) {
    console.log(
      `Unauthorized - Redirecting to /. Expected one of: ${allowedRoles}, Got: ${storedRole}`
    );
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
