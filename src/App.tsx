import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { SavedJobsPage } from "./pages/SavedJobsPage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { EmployerDashboardPage } from "./pages/EmployerDashboardPage";
import { EmployerJobFormPage } from "./pages/EmployerJobFormPage";
import { EmployerApplicantsPage } from "./pages/EmployerApplicantsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthProvider } from "./lib/AuthContext";
import { SavedJobsProvider } from "./lib/SavedJobsContext";
import { ProtectedRoute } from "./lib/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedJobsProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-surface-ground">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute role="student">
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute role="student">
                      <SavedJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute role="student">
                      <ApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/employer" element={
                  <ProtectedRoute role="employer"><EmployerDashboardPage /></ProtectedRoute>
                } />
                <Route path="/employer/jobs/new" element={
                  <ProtectedRoute role="employer"><EmployerJobFormPage /></ProtectedRoute>
                } />
                <Route path="/employer/jobs/:id/edit" element={
                  <ProtectedRoute role="employer"><EmployerJobFormPage /></ProtectedRoute>
                } />
                <Route path="/employer/jobs/:id/applicants" element={
                  <ProtectedRoute role="employer"><EmployerApplicantsPage /></ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </SavedJobsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
