import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import Layout from "./Layout/Layout";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Оборачиваем защищенные маршруты в Layout с Header и Sidebar
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
