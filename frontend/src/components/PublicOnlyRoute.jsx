import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicOnlyRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo) {
    if (userInfo.role === "farmer") return <Navigate to="/farmer/dashboard" replace />;
    if (userInfo.role === "expert") return <Navigate to="/expert/dashboard" replace />;
    if (userInfo.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}