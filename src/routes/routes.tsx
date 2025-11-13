import { createBrowserRouter, Outlet } from "react-router";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "./routes.enum";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Outlet />
      </PublicRoute>
    ),
    children: [
      // {
      //   path: ROUTES.LOGIN,
      //   element: <SignIn />,
      // },
      // {
      //   path: ROUTES.REGISTRATION,
      //   element: <Registration />,
      // },
      // {
      //   path: ROUTES.FORGOT_PASSWORD,
      //   element: <ForgotPassword />,
      // },
      // {
      //   path: ROUTES.RESET_PASSWORD,
      //   element: <ResetPassword />,
      // },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        {/* add layout */}
        <Outlet />
      </PrivateRoute>
    ),
    children: [
      // {
      //   index: true,
      //   element: <Home />,
      // },
      // {
      //   path: ROUTES.FOLLOWING,
      //   element: <Following />,
      // },
      // {
      //   path: ROUTES.CUSTOM_REQUEST,
      //   element: <CustomRequests />,
      // },
      // {
      //   path: ROUTES.SEARCH,
      //   element: <Search />,
      // },
      // {
      //   path: ROUTES.PROFILE,
      //   element: <Profile />,
      // },
      // {
      //   path: ROUTES.USER_PROFILE,
      //   element: <UserProfile />,
      // },
    ],
  },
]);
