"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronLeft, Shield, Vote } from "lucide-react"

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
    const Comp = asChild ? "button" : "button"

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

    if (asChild) {
      return <React.Fragment ref={ref} {...props} />
    }

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

export default function VotingPage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState(null)

  // Mock candidates data
  const candidates = [
    {
      id: "c1",
      name: "Rajesh Kumar",
      party: "National Democratic Party",
      symbol: "🌻", // Sunflower symbol
      color: "bg-yellow-100 border-yellow-300",
    },
    {
      id: "c2",
      name: "Priya Sharma",
      party: "Progressive Alliance",
      symbol: "✋", // Hand symbol
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "c3",
      name: "Amit Patel",
      party: "People's Front",
      symbol: "🚲", // Bicycle symbol
      color: "bg-green-100 border-green-300",
    },
    {
      id: "c4",
      name: "Sunita Verma",
      party: "Regional Unity Party",
      symbol: "🪔", // Lamp symbol
      color: "bg-red-100 border-red-300",
    },
  ]

  // Check if user is verified
  useEffect(() => {
    // Check if user has been verified
    const voteVerified = sessionStorage.getItem("voteVerified")
    if (!voteVerified) {
      navigate("/voting/verify")
      return
    }

    setIsVerified(true)

    // Get user data
    const storedUserData = sessionStorage.getItem("userData")
    if (!storedUserData) {
      navigate("/dashboard")
      return
    }

    try {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)
    } catch (error) {
      console.error("Error parsing user data:", error)
      navigate("/dashboard")
    }
  }, [navigate])

  // Handle candidate selection
  const selectCandidate = (candidate) => {
    if (hasVoted) return
    setSelectedCandidate(candidate)
  }

  // Handle vote submission
  const submitVote = () => {
    if (!selectedCandidate || hasVoted) return

    // In a real app, this would send the vote to a secure backend
    // For demo purposes, we'll just simulate a successful vote
    setTimeout(() => {
      setHasVoted(true)

      // Clear the verification flag so the user has to verify again for next vote
      sessionStorage.removeItem("voteVerified")
    }, 1500)
  }

  // Return to dashboard
  const returnToDashboard = () => {
    navigate("/dashboard")
  }

  if (!isVerified || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Verifying your identity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Electronic Voting System
            </span>
          </h1>
          <p className="mt-2 text-gray-600">
            {hasVoted ? "Your vote has been recorded" : "Select a candidate to cast your vote"}
          </p>
        </div>

        {hasVoted ? (
          <Card className="overflow-hidden border-none bg-white/90 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Vote Recorded Successfully</h2>
                <p className="max-w-md text-gray-600">
                  Your vote has been securely recorded. Thank you for participating in the democratic process.
                </p>

                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-left">
                  <h3 className="font-medium text-green-800">Vote Details</h3>
                  <div className="mt-2 space-y-2 text-sm text-green-700">
                    <p>
                      <span className="font-medium">Election:</span> General Elections 2025
                    </p>
                    <p>
                      <span className="font-medium">Voter ID:</span> {userData.voterID}
                    </p>
                    <p>
                      <span className="font-medium">Timestamp:</span> {new Date().toLocaleString()}
                    </p>
                    <p className="font-medium">Your vote has been encrypted and anonymized.</p>
                  </div>
                </div>

                <Button
                  onClick={returnToDashboard}
                  className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 overflow-hidden border-none bg-white/90 shadow-lg backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <CardTitle>Ballot Paper - General Elections 2025</CardTitle>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    Constituency: {userData.constituency || "Central District"}
                  </div>
                </div>
                <CardDescription>
                  Select one candidate by clicking on their name. Review your selection before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300 hover:bg-blue-50",
                        selectedCandidate?.id === candidate.id
                          ? "border-blue-500 bg-blue-50"
                          : `${candidate.color} border-gray-200`,
                      )}
                      onClick={() => selectCandidate(candidate)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                          {candidate.symbol}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                          {selectedCandidate?.id === candidate.id && (
                            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={submitVote}
                    disabled={!selectedCandidate}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    Submit Vote
                    <Vote className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Secure Voting Information</h4>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-blue-700">
                    <li>Your vote is anonymous and cannot be traced back to you</li>
                    <li>The system uses end-to-end encryption to protect your vote</li>
                    <li>You can only vote once in this election</li>
                    <li>If you need assistance, please contact the election helpdesk</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

