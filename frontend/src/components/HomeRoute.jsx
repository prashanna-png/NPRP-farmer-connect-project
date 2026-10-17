import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "../pages/HomePage";

function HomeRoute() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (userInfo?.role === "farmer") {
    return <Navigate to="/farmer/dashboard" replace />;
  }

  return <HomePage />;
}

export default HomeRoute;
