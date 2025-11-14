import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "./routes.enum";
import Login from "../components/auth/Login";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import LessonPlanning from "../pages/LessonPlanning";
import ContentLibrary from "../pages/ContentLibrary";
import Assessments from "../pages/Assessments";
import StudentProgress from "../pages/StudentProgress";
import AssistantChat from "../pages/AssistantChat";
import ParentReports from "../pages/ParentReports";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Outlet />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.LESSON_PLANNING,
        element: <LessonPlanning />,
      },
      {
        path: ROUTES.CONTENT_LIBRARY,
        element: <ContentLibrary />,
      },
      {
        path: ROUTES.ASSESSMENTS,
        element: <Assessments />,
      },
      {
        path: ROUTES.STUDENT_PROGRESS,
        element: <StudentProgress />,
      },
      {
        path: ROUTES.ASSISTANT_CHAT,
        element: <AssistantChat />,
      },
      {
        path: ROUTES.PARENT_REPORTS,
        element: <ParentReports />,
      },
    ],
  },
]);
