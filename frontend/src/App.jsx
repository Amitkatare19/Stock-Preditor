import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AadhaarVerificationPage from "./pages/AadhaarVerificationPage"
import OtpVerificationPage from "./pages/OtpVerificationPage"
import SuccessPage from "./pages/SuccessPage"

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-aadhaar" element={<AadhaarVerificationPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
  )
}

