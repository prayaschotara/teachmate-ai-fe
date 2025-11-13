import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { ROLE } from "../utils/constant";
import { ROUTES } from "./routes.enum";
interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function CreatorPrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (user && user.role !== ROLE.CREATOR) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (
    user?.oppVerification &&
    Object.keys(user?.oppVerification)?.length &&
    Object.values(user?.oppVerification)?.some((item) => item === false)
  ) {
    return <Navigate to={ROUTES.CREATOR_VERIFICATION} replace />;
  }
  return <>{children}</>;
}
