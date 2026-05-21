import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { sidebarItems } from "../../lib/SidebarItems";


// Safe JWT expiration checker
const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true; // Invalid token format
    const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(decodedJson);
    if (!decoded.exp) return false; // Assume not expired if no exp claim
    return decoded.exp * 1000 < Date.now();
  } catch (e) {
    return true; // Treat parsing error as expired/invalid
  }
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = Cookies.get("accessToken");
  const role = Cookies.get("role");

  const isExpired = token ? isTokenExpired(token) : true;

  if (!token || isExpired) {
    if (token) {
      Cookies.remove("accessToken");
      Cookies.remove("role");
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname.replace("/", "");

  const currentPage = sidebarItems.find((item: any) => item.path === currentPath);

  if (!currentPage) return children;

  // 🔹 ADMIN can only access public pages
  if (role === "ADMIN" && !currentPage.public) {
    return <Navigate to="/" replace />;
  }
 
  return children;
};

export default PrivateRoute;