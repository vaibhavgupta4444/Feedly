import { createBrowserRouter } from "react-router";
import App from "./App";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Feed from "./pages/feed";
import Profile from "./pages/profile";
import Notifications from "./pages/notifications";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },

  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/feed",
        Component: Feed,
      },
      {
        path: "/profile/:userId",
        Component: Profile,
      },
      {
        path: "/notifications",
        Component: Notifications,
      },
      {
        path: "/reset-password",
        Component: ResetPassword,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;