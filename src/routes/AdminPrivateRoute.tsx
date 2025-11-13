import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { ROLE } from "../utils/constant";
import { ROUTES } from "./routes.enum";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function AdminPrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user && user.role !== ROLE.ADMIN) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
