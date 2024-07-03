import { Outlet, Navigate } from "react-router";
import { alertError } from "./Components/AlertOast";
import { useAuth } from "./context/auth/AuthContext";
import { removeStorageItem } from "./custom-hooks/useLocalStorage";
import { NavMenu } from "./Components/common/navMenu/NavMenu";
import { NavBar } from "./Components/NavBar/NavBar";
import { RecipesProvider } from "./context/Recipe/RecipesContext";

const ProtectedRoute = ({ redirectPath = "/login", children, adminRoute, adminContextRoute }) => {
  const { AuthReset, userState } = useAuth();

  if (!userState.token?._id) {
    return <Navigate to={redirectPath} replace />;
  }

  if (userState.token.exp < (new Date().getTime() + 1) / 1000) {
    removeStorageItem("travel");
    removeStorageItem("bubbles");
    AuthReset();
    return false;
  }

  if (adminRoute && userState.token?.role !== "staff" && userState.token?.role !== "admin") {
    alertError("אין לך את ההרשאות המתאימות");
    return <Navigate to={redirectPath} replace />;
  }

  if (adminRoute && (userState.token?.role === "staff" || userState.token?.role === "admin")) {
    return children ? (
      <RecipesProvider>
        <NavMenu />
        {children}
        <NavBar />
      </RecipesProvider>
    ) : (
      <RecipesProvider>
        <NavMenu />
        {<Outlet />}
        <NavBar />
      </RecipesProvider>
    );
  }

  return (
    <RecipesProvider>
      <NavMenu />
      {children ? { children } : <Outlet />}
      <NavBar />
    </RecipesProvider>
  );
};

export default ProtectedRoute;
