import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "./slices/authSlice";
import api from "./api/axios";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRoute from "./components/HomeRoute";
import ProfilePage from "./pages/ProfilePage";

import NoticesPage from "./pages/NoticesPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FarmerDashboard from "./pages/FarmerDashboard";

import AskExpertPage from "./pages/AskExpertPage";
import MyQuestionsPage from "./pages/MyQuestionsPage";
import QueryDetailsPage from "./pages/QueryDetailsPage";

import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertQuestionsPage from "./pages/ExpertQuestionsPage";
import ExpertQuestionDetailsPage from "./pages/ExpertQuestionDetailsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import AdminExpertsPage from "./pages/AdminExpertsPage";
import AdminManageNotices from "./pages/AdminManageNoticesPage";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        dispatch(setCredentials({ userInfo: data.user }));
      } catch {
        dispatch(clearCredentials());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/notices" element={<NoticesPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/ask-expert" element={<AskExpertPage />} />
            <Route path="/my-queries" element={<MyQuestionsPage />} />
            <Route path="/my-queries/:id" element={<QueryDetailsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["expert"]} />}>
            <Route path="/expert/dashboard" element={<ExpertDashboard />} />
            <Route path="/expert/questions" element={<ExpertQuestionsPage />} />
            <Route
              path="/expert/questions/:id"
              element={<ExpertQuestionDetailsPage />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/questions" element={<AdminQuestionsPage />} />
            <Route path="/admin/experts" element={<AdminExpertsPage />} />
            <Route path="/admin/notices" element={<AdminManageNotices />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
