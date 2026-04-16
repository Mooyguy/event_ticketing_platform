import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem("user");
  const token = window.localStorage.getItem("token");

  if (!storedUser || !token) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
  console.error("Invalid user data:", error);
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("token");
  return <Navigate to="/login" replace />;
}

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}