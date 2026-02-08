import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const rol = localStorage.getItem("rol")?.toLowerCase();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(rol)) {
    console.warn(`⛔ Acceso denegado para el rol: ${rol}`);
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
