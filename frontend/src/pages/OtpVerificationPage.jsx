"use client"

import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Lock, Mail, Shield } from "lucide-react"

// Simple utility function for combining class names without dependencies
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ")
    .replace(/border-border/g, "border")
}

// UI Components
const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    let variantClasses = ""
    if (variant === "default") variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
    else if (variant === "destructive")
      variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    else if (variant === "outline")
      variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    else if (variant === "secondary") variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    else if (variant === "ghost") variantClasses = "hover:bg-accent hover:text-accent-foreground"
    else if (variant === "link") variantClasses = "text-primary underline-offset-4 hover:underline"

    let sizeClasses = ""
    if (size === "default") sizeClasses = "h-10 px-4 py-2"
    else if (size === "sm") sizeClasses = "h-9 rounded-md px-3"
    else if (size === "lg") sizeClasses = "h-11 rounded-md px-8"
    else if (size === "icon") sizeClasses = "h-10 w-10"

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Label.displayName = "Label"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses =
    variant === "default"
      ? "bg-background text-foreground"
      : "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variantClasses,
        className,
      )}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export default function OtpVerificationPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [maskedPhone, setMaskedPhone] = useState("")
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [aadhaarNumber, setAadhaarNumber] = useState("")

  // Refs for OTP inputs
  const otpRefs = useRef([])

  // Set up OTP refs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6)
  }, [])

  // Get data from session storage
  useEffect(() => {
    const storedAadhaar = sessionStorage.getItem("aadhaarNumber")
    const storedPhone = sessionStorage.getItem("maskedPhone")

    if (!storedAadhaar) {
      // If no Aadhaar in session, redirect back to Aadhaar verification
      navigate("/verify-aadhaar")
      return
    }

    setAadhaarNumber(storedAadhaar)
    setMaskedPhone(storedPhone || "")

    // Focus first OTP input
    setTimeout(() => {
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus()
      }
    }, 100)
  }, [navigate])

  // Timer for OTP resend
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }

    return () => clearInterval(interval)
  }, [timer])

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus()
    }

    // Clear error when user types
    if (errors.otp) {
      setErrors({ ...errors, otp: null })
    }
  }

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus()
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is numeric and has correct length
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const newOtp = [...otp]

      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) {
          newOtp[i] = pastedData[i]
        }
      }

      setOtp(newOtp)

      // Focus the appropriate input after paste
      if (pastedData.length < 6) {
        otpRefs.current[pastedData.length].focus()
      }
    }
  }

  // Validate OTP
  const validateOtp = () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setErrors({ ...errors, otp: "Please enter the complete 6-digit OTP" })
      return false
    }

    // In a real app, you would validate the OTP with an API
    return true
  }

  // Resend OTP
  const resendOtp = () => {
    if (!canResend) return

    // Reset OTP fields
    setOtp(["", "", "", "", "", ""])

    // Reset timer
    setTimer(30)
    setCanResend(false)

    // Focus first OTP input
    setTimeout(() => {
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus()
      }
    }, 100)
  }

  // Verify OTP
  const verifyOtp = () => {
    if (validateOtp()) {
      setIsSubmitting(true)

      // Simulate API call to verify OTP
      setTimeout(() => {
        setIsSubmitting(false)

        // Navigate to success page
        navigate("/success")
      }, 1500)
    }
  }

  // Go back to Aadhaar verification
  const goBack = () => {
    navigate("/verify-aadhaar")
  }

  // Format timer display
  const formatTime = (seconds) => {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div
          style={{
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Voter Registration
            </span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">Step 2: OTP Verification</p>
        </div>

        <div
          style={{
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <Card className="overflow-hidden border-none bg-white/90 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />

            <CardHeader className="relative space-y-1 border-b border-gray-100 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500">Step 2 of 2</span>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-bold">OTP Verification</CardTitle>
              <CardDescription>Enter the OTP sent to your Aadhaar-linked mobile number</CardDescription>
            </CardHeader>

            <CardContent className="relative px-6 pt-6">
              <div className="space-y-6">
                <Alert className="border-blue-100 bg-blue-50 text-blue-800">
                  <AlertDescription className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4" />
                    OTP has been sent to your Aadhaar-linked mobile number {maskedPhone}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Enter 6-digit OTP
                  </Label>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : null}
                        maxLength={1}
                        className={`h-12 w-12 rounded-lg border-gray-200 bg-white p-0 text-center text-xl shadow-sm transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.otp ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-xs font-medium text-red-500">{errors.otp}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Enter the OTP sent to your mobile</p>
                    {timer > 0 ? (
                      <p className="text-xs text-gray-500">Resend in {formatTime(timer)}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        disabled={!canResend}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                      <p className="mt-1 text-xs text-yellow-700">
                        After verification, your QR code will be sent to your Aadhaar-linked mobile number. This QR code
                        is required for voting.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={goBack}
                    variant="outline"
                    className="flex w-1/3 items-center border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Back
                  </Button>

                  <Button
                    onClick={verifyOtp}
                    disabled={isSubmitting || otp.join("").length !== 6}
                    className="relative w-2/3 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="relative mt-4 flex flex-col space-y-2 border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
              <p className="flex items-center justify-center">
                <Shield className="mr-1 h-3 w-3 text-gray-400" />
                Your data is encrypted and securely processed
              </p>
              <p>
                Having trouble?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Contact support
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Add custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

