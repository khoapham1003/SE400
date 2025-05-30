//Layout
import UnlogLayout from "../Layouts/UnlogLayout";
import LogLayout from "../Layouts/LogLayout";
import DefaultLayout from "../Layouts/DefaultLayout";

//Pages
import SignIn from "../../pages/SignIn/SignIn";
import SignUp from "../../pages/SignUp/SignUp";
import AdminPage from "../../pages/AdminPage";
import ConfirmOrderPage from "../../pages/AdminPage/Component/Order/ConfirmOrderPage";

function DefineLayout() {
  const isUserAuthenticated = () => {
    const accessToken = getCookie("accessToken");
    const userid = getCookie("userid");

    if (accessToken && userid) {
      try {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));

        if (decodedToken && decodedToken.exp) {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          return decodedToken.exp > currentTimeInSeconds;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return false;
  };

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };
  return isUserAuthenticated() ? DefaultLayout : UnlogLayout;
}

//PublicRoutes
const publicRoutes = [
  { path: "/", component: SignIn, layout: LogLayout },
  { path: "/sign_up", component: SignUp, layout: LogLayout },
];
//PrivateRoutes
const privateRoutes = [
  { path: "/admin", component: AdminPage, layout: DefineLayout() },
  { path: "/confirmorder/:id", component: ConfirmOrderPage, layout: DefineLayout() },
];

export { publicRoutes, privateRoutes };
