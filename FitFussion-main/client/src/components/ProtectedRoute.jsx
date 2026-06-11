import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Pull your authenticated token payload from the browser's local storage
  const userToken = localStorage.getItem("userInfo");

  // If the user token doesn't exist, block the page and redirect to login instantly
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  // If token is found, safely render the requested children pages
  return children;
};

export default ProtectedRoute;