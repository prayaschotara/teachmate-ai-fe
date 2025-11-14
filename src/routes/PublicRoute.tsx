import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { ROUTES } from "./routes.enum";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
