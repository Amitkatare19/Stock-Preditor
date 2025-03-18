"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, CheckCircle2, Download, Home, QrCode, Shield } from "lucide-react"

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

  // Get data from session storage
  useEffect(() => {
    const storedAadhaar = sessionStorage.getItem("aadhaarNumber")

    if (!storedAadhaar) {
      // If no Aadhaar in session, redirect back to home
      navigate("/")
      return
    }

    setAadhaarNumber(storedAadhaar)
  }, [navigate])

  // Function to handle going to home page
  const goToHome = () => {
    navigate("/")
  }

  // Function to handle QR code download
  const downloadQR = () => {
    // In a real app, you would generate and download the QR code
    alert("QR Code download started...")
  }

  // Function to register another voter
  const registerAnother = () => {
    // Clear session storage
    sessionStorage.removeItem("aadhaarNumber")
    sessionStorage.removeItem("maskedPhone")

    // Navigate to home
    navigate("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
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

          <CardContent className="relative space-y-6 px-8 pb-8 pt-2">
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-white p-4 shadow-inner">
                <QrCode className="h-32 w-32 text-gray-800" strokeWidth={1} />
              </div>
              <p className="text-center text-sm text-gray-600">
                Your unique voting QR code is ready. You can download it or scan it directly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={goToHome}
                variant="outline"
                className="flex items-center justify-center space-x-2 border-gray-200 bg-white hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                <span>Go to Home</span>
              </Button>
              <Button
                onClick={downloadQR}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="h-4 w-4" />
                <span>Download QR</span>
              </Button>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Important Instructions</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-700">
                    <li>Keep your QR code safe and confidential</li>
                    <li>You'll need this QR code to vote on election day</li>
                    <li>Save a backup copy in a secure location</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Warning */}
            <Alert className="border-yellow-100 bg-yellow-50 text-yellow-800">
              <AlertDescription className="flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Do not share your QR code with anyone. It contains your secure voting credentials.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="relative border-t border-gray-100 bg-gray-50 px-8 py-4">
            <Button
              onClick={registerAnother}
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
              Register Another Voter
            </Button>
          </CardFooter>
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
      `}</style>
    </div>
  )
}

