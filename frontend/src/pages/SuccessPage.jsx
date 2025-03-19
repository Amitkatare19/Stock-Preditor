"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, CheckCircle2, Home, Shield } from "lucide-react"

// Simple utility function for combining class names without dependencies
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ")
    .replace(/border-border/g, "border")
}

// UI Components
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

export default function SuccessPage() {
  const navigate = useNavigate()
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [countdown, setCountdown] = useState(5)

  // Get data from session storage
  useEffect(() => {
    const storedAadhaar = sessionStorage.getItem("aadhaarNumber")

    if (!storedAadhaar) {
      // If no Aadhaar in session, redirect back to home
      navigate("/")
      return
    }

    setAadhaarNumber(storedAadhaar)

    // Set up mock user data for dashboard
    const mockUserData = {
      name: "John Doe",
      dob: "15/08/1985",
      gender: "Male",
      address: "123 Main Street, Bangalore, Karnataka",
      phone: "******7890",
      email: "j****@example.com",
      aadhaar: storedAadhaar,
      voterID: "ABC" + Math.floor(10000000 + Math.random() * 90000000),
    }

    // Store user data in session storage for dashboard
    sessionStorage.setItem("userData", JSON.stringify(mockUserData))
  }, [navigate])

  // Set up countdown and redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  // Function to handle going to home page
  const goToHome = () => {
    navigate("/")
  }

  // Function to go to dashboard immediately
  const goToDashboard = () => {
    navigate("/dashboard")
  }

  // Calculate the percentage for the circular progress
  const circleCircumference = 2 * Math.PI * 18 // 18 is the radius of the circle
  const circleOffset = circleCircumference - (countdown / 5) * circleCircumference

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="w-full max-w-md animate-fadeIn"
        style={{
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <Card className="overflow-hidden border-none bg-white/90 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />

          <CardHeader className="relative space-y-1 pb-6">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-3xl font-bold">Verification Successful!</CardTitle>
            <CardDescription className="text-center text-base">
              You are now verified and can proceed to download or scan your QR code
            </CardDescription>
          </CardHeader>

          {/* Beautiful Timer */}
          <div className="relative mx-auto -mt-2 mb-4 flex max-w-xs items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-3">
            <div className="flex items-center space-x-3">
              {/* Circular countdown timer */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg className="h-12 w-12 -rotate-90 transform">
                  <circle cx="24" cy="24" r="18" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="4" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-xl font-bold text-blue-700">{countdown}</span>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-700">Redirecting to dashboard</p>
                <p className="text-xs text-gray-500">
                  in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>
              </div>
            </div>
          </div>

          {/* Beautiful Timer */}
          <CardContent className="relative space-y-6 px-8 pb-8 pt-2">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-white p-4 shadow-inner">
                <Shield className="h-32 w-32 text-blue-600" strokeWidth={1} />
              </div>
              <p className="text-center text-sm text-gray-600">
                Your registration is complete! Your secure voting QR code will be available in your dashboard on
                election day.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={goToDashboard}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Home className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Button>
            </div>

            {/* Security Warning */}
            <Alert className="border-yellow-100 bg-yellow-50 text-yellow-800">
              <AlertDescription className="flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Your QR code will be available in your dashboard on election day. Keep your login credentials secure.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

