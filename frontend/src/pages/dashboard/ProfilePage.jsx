"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, Edit, Lock, Mail, MapPin, Phone, QrCode, Shield, User } from "lucide-react"

// Simple utility function for combining class names without dependencies
const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .join(" ")
    .replace(/border-border/g, "border")
}

// Card components
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

// Button component
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

// Badge component
const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "success" && "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        variant === "destructive" &&
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && "text-foreground",
        variant === "warning" && "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        className,
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [showQrModal, setShowQrModal] = useState(false)

  const [isElectionDay, setIsElectionDay] = useState(false)
  const [qrCodeLocked, setQrCodeLocked] = useState(true)

  // Add this function to check if it's election day (for demo purposes)
  const checkIfElectionDay = () => {
    // In a real app, this would check against the actual election date
    // For demo purposes, we'll just toggle the state
    setIsElectionDay(!isElectionDay)
    setQrCodeLocked(!qrCodeLocked)
  }

  // Get user data from session storage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">View and manage your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Voter Information</CardTitle>
              <CardDescription>Your personal details and voter information</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="h-4 w-4" />
              <span>View QR</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row">
              <div className="mb-6 flex flex-col items-center md:mb-0 md:w-1/3 md:border-r md:pr-6">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{userData.name}</h3>
                <p className="text-sm text-gray-500">Voter ID: {userData.voterID}</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>Download ID</span>
                  </Button>
                </div>
              </div>

              <div className="md:w-2/3 md:pl-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Full Name</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{userData.name}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Date of Birth</h4>
                    <p className="text-gray-900">{userData.dob}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Gender</h4>
                    <p className="text-gray-900">{userData.gender}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Aadhaar Number</h4>
                    <div className="flex items-center">
                      <p className="text-gray-900">{userData.aadhaar}</p>
                      <Badge variant="success" className="ml-2">
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Phone Number</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{userData.phone}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Email</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{userData.email}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Address</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{userData.address}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center rounded-md border border-gray-200 p-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Phone Number</h4>
                  <p className="text-gray-900">{userData.phone}</p>
                </div>
              </div>

              <div className="flex items-center rounded-md border border-gray-200 p-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Email Address</h4>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center rounded-md border border-gray-200 p-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Residential Address</h4>
                  <p className="text-gray-900">{userData.address}</p>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  to="/dashboard/settings"
                  className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Update Contact Information
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Status of your identity verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-md bg-green-50 p-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Aadhaar Verification</h4>
                    <p className="text-sm text-green-700">Verified on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md bg-green-50 p-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Voter ID</h4>
                    <p className="text-sm text-green-700">Verified on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-md bg-yellow-50 p-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800">Address Proof</h4>
                    <p className="text-sm text-yellow-700">Awaiting verification</p>
                  </div>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Verification Information</h4>
                  <p className="mt-1 text-xs text-blue-700">
                    Your identity has been verified using your Aadhaar details. To complete address verification, please
                    upload a valid address proof document in the Documents section.
                  </p>
                  <div className="mt-3">
                    <Link
                      to="/dashboard/documents"
                      className="inline-flex items-center text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      Upload Address Proof
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Your Voter QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={() => setShowQrModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-white p-4">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  {qrCodeLocked ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative mb-4">
                        <QrCode className="h-48 w-48 text-gray-200" strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="h-16 w-16 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">QR Code Locked</p>
                        <p className="text-sm text-gray-500">Your QR code will be available on election day</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <QrCode className="h-48 w-48 text-gray-800" strokeWidth={1} />
                      <div className="mt-4 text-center">
                        <p className="font-medium text-gray-900">Voter ID: {userData.voterID}</p>
                        <p className="text-sm text-gray-500">Scan this QR code at the polling station</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowQrModal(false)}>
                Close
              </Button>
              {qrCodeLocked ? (
                // For demo purposes only - in a real app this button wouldn't exist
                <Button variant="outline" onClick={checkIfElectionDay}>
                  {isElectionDay ? "Lock QR Code" : "Simulate Election Day"}
                </Button>
              ) : (
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

