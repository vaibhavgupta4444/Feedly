import { createBrowserRouter } from "react-router";
import App from "./App";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/signup";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/signin",
    Component: SignIn
  },
  {
    path: "/signup",
    Component: SignUp
  },
]);

export default router