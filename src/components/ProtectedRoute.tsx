import { Navigate, Outlet } from "react-router";
import React from "react";

const ProtectedRoute:React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;