import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRoute from "./components/HomeRoute";

import NoticesPage from "./pages/NoticesPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FarmerDashboard from "./pages/FarmerDashboard";

import AskExpertPage from "./pages/AskExpertPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/notices" element={<NoticesPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
