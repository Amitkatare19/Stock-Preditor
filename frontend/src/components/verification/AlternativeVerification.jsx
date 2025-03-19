"use client"

import React, { useState } from "react"
import { useVerification } from "../../context/VerificationContext"
import { Button } from "./UIComponents"
import { Shield, AlertCircle } from "lucide-react"

const AlternativeVerification = () => {
  const {
    userData,
    isLoading,
    isLockedOut,
    lockoutTime,
    formatTime,
    showAlert,
    handleFailedAttempt,
    handleSecondaryVerificationSuccess,
    handleSecondaryVerificationError,
  } = useVerification()

  const [step, setStep] = useState(1) // 1: ID verification, 2: Security questions, 3: OTP
  const [idNumber, setIdNumber] = useState("")
  const [dob, setDob] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [correctSecurityAnswer, setCorrectSecurityAnswer] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState("")
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState("")
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes
  const [error, setError] = useState(null)

  // Load security question
  React.useEffect(() => {
    // In a real app, this would be fetched from the server based on the user
    const securityQuestions = [
      { question: "What was the name of your first pet?", answer: "fluffy" },
      { question: "In which city were you born?", answer: "mumbai" },
      { question: "What was the model of your first car?", answer: "swift" },
      { question: "What is your mother's maiden name?", answer: "patel" },
      { question: "What was the name of your primary school?", answer: "st. mary" },
    ]

    const randomIndex = Math.floor(Math.random() * securityQuestions.length)
    setSecurityQuestion(securityQuestions[randomIndex].question)
    setCorrectSecurityAnswer(securityQuestions[randomIndex].answer)
  }, [])

  // Verify ID information
  const verifyIdInformation = (e) => {
    e.preventDefault()

    if (isLockedOut) {
      showAlert(`Too many failed attempts. Please try again in ${formatTime(lockoutTime)}.`, "error")
      return
    }

    // Simple validation
    if (!idNumber || !dob) {
      setError("Please fill in all required fields.")
      return
    }

    // For demo purposes, accept any input with proper format
    // In a real app, this would validate against actual voter records
    if (idNumber.length >= 8 && dob) {
      setStep(2)
      setError(null)
    } else {
      handleFailedAttempt()
      setError("Invalid ID number or date of birth. Please check and try again.")
    }
  }

  // Verify security question
  const verifySecurityQuestion = (e) => {
    e.preventDefault()

    if (isLockedOut) {
      showAlert(`Too many failed attempts. Please try again in ${formatTime(lockoutTime)}.`, "error")
      return
    }

    if (!securityAnswer) {
      setError("Please answer the security question.")
      return
    }

    // Case-insensitive comparison
    if (securityAnswer.toLowerCase() === correctSecurityAnswer.toLowerCase()) {
      setStep(3)
      sendOtp()
      setError(null)
    } else {
      handleFailedAttempt()
      setError("Incorrect answer. Please try again.")
    }
  }

  // Send OTP
  const sendOtp = () => {
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    setPhoneOtp(otpCode)
    setOtpSent(true)

    // In a real app, this would be sent to the user's phone
    console.log(`Phone OTP: ${otpCode}`)

    showAlert(
      `An OTP has been sent to your registered phone number ending in ${userData?.phoneNumber ? userData.phoneNumber.slice(-4) : "****"}`,
      "info",
    )
  }

  // Verify OTP
  const verifyOtp = (e) => {
    e.preventDefault()

    if (isLockedOut) {
      showAlert(`Too many failed attempts. Please try again in ${formatTime(lockoutTime)}.`, "error")
      return
    }

    if (!enteredPhoneOtp) {
      setError("Please enter the OTP.")
      return
    }

    if (enteredPhoneOtp === phoneOtp) {
      handleSecondaryVerificationSuccess()
      setError(null)
    } else {
      handleFailedAttempt()
      setError("Incorrect OTP. Please check and try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Alternative Verification</h4>
            <p className="mt-1 text-xs text-blue-700">
              {step === 1 && "Please verify your identity using your voter ID and date of birth."}
              {step === 2 && "Please answer your security question to proceed."}
              {step === 3 && "Enter the OTP sent to your registered phone number."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
          <AlertCircle className="mr-1 inline-block h-4 w-4" />
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={verifyIdInformation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Voter ID / Aadhaar Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your ID number"
              required
              disabled={isLockedOut || isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isLockedOut || isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isLockedOut || !idNumber || !dob}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Verifying..." : "Verify Information"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifySecurityQuestion} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Security Question</label>
            <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
              {securityQuestion}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700">
              Your Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your answer"
              required
              disabled={isLockedOut || isLoading}
            />
            <p className="text-xs text-gray-500">For demo purposes, the answer is: {correctSecurityAnswer}</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isLockedOut || !securityAnswer}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Verifying..." : "Verify Answer"}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phoneOtp" className="block text-sm font-medium text-gray-700">
              Phone OTP
            </label>
            <input
              type="text"
              id="phoneOtp"
              value={enteredPhoneOtp}
              onChange={(e) => setEnteredPhoneOtp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              placeholder="Enter 6-digit OTP sent to your phone"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isLockedOut || isLoading}
            />
            <p className="text-xs text-gray-500">For demo purposes, the OTP is: {phoneOtp}</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isLockedOut || !enteredPhoneOtp}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>
              Didn't receive the OTP?{" "}
              <button
                type="button"
                onClick={sendOtp}
                disabled={isLockedOut}
                className="text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

export default AlternativeVerification

