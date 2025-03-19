import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AadhaarVerificationPage from "./pages/AadhaarVerificationPage"
import OtpVerificationPage from "./pages/OtpVerificationPage"
import SuccessPage from "./pages/SuccessPage"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import ProfilePage from "./pages/dashboard/ProfilePage"
import ElectionsPage from "./pages/dashboard/ElectionsPage"
import DocumentsPage from "./pages/dashboard/DocumentsPage"
import SettingsPage from "./pages/dashboard/SettingsPage"
import HelpSupportPage from "./pages/dashboard/HelpSupportPage"
import ElectionDetailsPage from "./pages/dashboard/ElectionDetailsPage"
import PollingMapPage from "./pages/dashboard/PollingMapPage"
import NotFoundPage from "./pages/NotFoundPage"
import VoteVerificationPage from "./pages/voting/VoteVerificationPage"
import VotingPage from "./pages/voting/VotingPage"

// Admin imports - simplified for voter registration only
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminHome from "./pages/admin/AdminHome"
import RegisterUserPage from "./pages/admin/RegisterUserPage"
import VoterManagement from "./pages/admin/VoterManagement"
import { VoterProvider } from "./context/VoterContext"

export default function App() {
  return (
    <Router>
      <VoterProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/verify-aadhaar" element={<AadhaarVerificationPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Voting routes */}
          <Route path="/voting/verify" element={<VoteVerificationPage />} />
          <Route path="/voting/cast-vote" element={<VotingPage />} />

          {/* Dashboard routes with shared layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="elections" element={<ElectionsPage />} />
            <Route path="elections/:id" element={<ElectionDetailsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpSupportPage />} />
            <Route path="polling-map" element={<PollingMapPage />} />
          </Route>

          {/* Admin routes - simplified for voter registration only */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="register-user" element={<RegisterUserPage />} />
            <Route path="voters" element={<VoterManagement />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </VoterProvider>
    </Router>
  )
}

