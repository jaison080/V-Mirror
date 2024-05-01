import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ children }: { children: ReactNode }): JSX.Element => {
  const { isUserLoggedIn } = useContext(UserContext);
  let location = useLocation();

  if (!isUserLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
