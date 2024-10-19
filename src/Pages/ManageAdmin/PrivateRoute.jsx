import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRole }) => {
  const storedRoleId = localStorage.getItem("roleId");

  let roleId = null;
  try {
    roleId =
      storedRoleId && storedRoleId !== "undefined"
        ? JSON.parse(storedRoleId)
        : null;
  } catch (error) {
    console.error("Error parsing roleId:", error);
    roleId = null;
  }

  console.log("Parsed roleId:", roleId); // Log kiểm tra roleId

  if (roleId !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
