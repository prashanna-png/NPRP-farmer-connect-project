import { Routes, Route } from "react-router-dom";

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
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
