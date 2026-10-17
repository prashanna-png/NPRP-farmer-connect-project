import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicOnlyRoute() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (userInfo) {
    if (userInfo.role === "farmer") {
      return <Navigate to="/farmer/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
