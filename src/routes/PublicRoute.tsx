import React from "react";
import { Navigate } from "react-router";
import { ROLE } from "../utils/constant";
import { useAuthStore } from "../store/authStore";
import { ROUTES } from "./routes.enum";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (user && (user.role === ROLE.USER || user.role === ROLE.CREATOR)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
