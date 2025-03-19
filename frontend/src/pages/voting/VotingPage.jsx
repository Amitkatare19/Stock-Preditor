"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Check, ChevronRight, HelpCircle, Info, Shield, Vote } from "lucide-react"

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

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default function VotingPage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCandidateDetails, setShowCandidateDetails] = useState(false)
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [voteReceipt, setVoteReceipt] = useState(null)

  // Check if user is verified
  useEffect(() => {
    const isVerified = sessionStorage.getItem("voteVerified")
    if (!isVerified) {
      navigate("/voting/verify")
      return
    }

    // Load user data
    try {
      const storedUserData = sessionStorage.getItem("userData")
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }

    // Load candidates
    loadCandidates()
  }, [navigate])

  // Load candidates (mock data for demo)
  const loadCandidates = () => {
    const mockCandidates = [
      {
        id: 1,
        name: "Rajesh Kumar",
        party: "National Democratic Alliance",
        partyShort: "NDA",
        symbol: "🌷", // Lotus symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-orange-100 border-orange-300",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
        details: {
          age: 52,
          education: "Ph.D. in Public Policy",
          experience: "15 years as Member of Parliament",
          manifesto: [
            "Infrastructure development in rural areas",
            "Job creation through manufacturing sector",
            "National security enhancement",
            "Digital India initiatives",
          ],
        },
      },
      {
        id: 2,
        name: "Priya Sharma",
        party: "United Progressive Alliance",
        partyShort: "UPA",
        symbol: "✋", // Hand symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-blue-100 border-blue-300",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        details: {
          age: 48,
          education: "Master's in Economics",
          experience: "Former State Minister, 10 years in politics",
          manifesto: [
            "Universal healthcare access",
            "Education reforms and scholarships",
            "Women's empowerment programs",
            "Environmental protection policies",
          ],
        },
      },
      {
        id: 3,
        name: "Amit Patel",
        party: "Regional People's Front",
        partyShort: "RPF",
        symbol: "🚲", // Bicycle symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-green-100 border-green-300",
        buttonColor: "bg-green-600 hover:bg-green-700",
        details: {
          age: 45,
          education: "Law Degree",
          experience: "Grassroots activist, 8 years as MLA",
          manifesto: [
            "Regional autonomy and development",
            "Agricultural subsidies and farmer support",
            "Local language and cultural preservation",
            "Water resource management",
          ],
        },
      },
      {
        id: 4,
        name: "Sunita Reddy",
        party: "Progressive Democratic Party",
        partyShort: "PDP",
        symbol: "🔔", // Bell symbol
        image: "/placeholder.svg?height=100&width=100",
        color: "bg-purple-100 border-purple-300",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        details: {
          age: 39,
          education: "MBA and Social Work",
          experience: "NGO founder, 5 years in politics",
          manifesto: [
            "Universal basic income pilot programs",
            "Technology sector development",
            "Healthcare modernization",
            "Urban housing and transportation",
          ],
        },
      },
    ]

    setCandidates(mockCandidates)
  }

  // Select a candidate
  const selectCandidate = (candidate) => {
    setSelectedCandidate(candidate)
  }

  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidateDetails(candidate)
    setShowCandidateDetails(true)
  }

  // Submit vote
  const submitVote = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before submitting your vote.")
      return
    }

    setShowConfirmation(true)
  }

  // Confirm vote
  const confirmVote = () => {
    setIsVoting(true)
    setShowConfirmation(false)

    // Simulate API call to submit vote
    setTimeout(() => {
      // Generate a vote receipt
      const receipt = {
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString(),
        constituency: userData?.constituency || "Central Delhi",
        boothId: "B" + Math.floor(1000 + Math.random() * 9000),
        verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      }

      setVoteReceipt(receipt)
      setVoteSubmitted(true)
      setIsVoting(false)

      // Store vote status in session
      sessionStorage.setItem("hasVoted", "true")
    }, 2000)
  }

  // Toggle help section
  const toggleHelp = () => {
    setShowHelp((prev) => !prev)
  }

  // Toggle security info
  const toggleSecurityInfo = () => {
    setShowSecurityInfo((prev) => !prev)
  }

  // Return to dashboard
  const returnToDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-6">
        <div
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cast Your Vote
            </span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            General Elections 2025 - {userData?.constituency || "Your Constituency"}
          </p>

          {/* User info summary */}
          {userData && (
            <div className="mt-4 flex items-center justify-center">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Vote className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{userData.name}</p>
                    <p className="text-sm text-gray-500">Voter ID: {userData.voterID}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <Card className="overflow-hidden border-none bg-white/90 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />

            <CardHeader className="relative space-y-1 border-b border-gray-100 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Vote className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleHelp}
                    className="rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-bold">
                {voteSubmitted ? "Vote Submitted Successfully" : "Select Your Candidate"}
              </CardTitle>
              <CardDescription>
                {voteSubmitted
                  ? "Thank you for participating in the democratic process"
                  : "Choose one candidate from the list below"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative px-6 pt-6">
              <div className="space-y-6">
                {/* Help section */}
                {showHelp && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
                    <h4 className="mb-2 font-medium text-blue-800">Voting Instructions</h4>
                    <div className="space-y-2 text-blue-700">
                      <p>• Review each candidate's information carefully before making your choice.</p>
                      <p>• Click on a candidate card to select them.</p>
                      <p>• Click "View Details" to see more information about a candidate.</p>
                      <p>• After selecting, click "Submit Vote" to confirm your choice.</p>
                      <p>• You will have one final chance to confirm before your vote is recorded.</p>
                      <p>• Once submitted, your vote cannot be changed.</p>
                    </div>
                    <button onClick={toggleHelp} className="mt-2 text-blue-600 hover:text-blue-800 hover:underline">
                      Close Help
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                    <AlertCircle className="mr-1 inline-block h-4 w-4" />
                    {error}
                  </div>
                )}

                {!voteSubmitted ? (
                  <>
                    {/* Candidates list */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={cn(
                            "relative cursor-pointer overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md",
                            selectedCandidate?.id === candidate.id
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                              : `${candidate.color} hover:border-gray-300`,
                          )}
                          onClick={() => selectCandidate(candidate)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="mt-2 text-center text-2xl">{candidate.symbol}</div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                              <p className="text-sm text-gray-600">{candidate.party}</p>
                              <p className="text-xs text-gray-500">({candidate.partyShort})</p>
                              <div className="mt-2 flex space-x-2">
                                <button
                                  type="button"
                                  className="rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    viewCandidateDetails(candidate)
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                            {selectedCandidate?.id === candidate.id && (
                              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Security information */}
                    <button
                      onClick={toggleSecurityInfo}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Voting Security Information</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-gray-500 transition-transform ${showSecurityInfo ? "rotate-90" : ""}`}
                      />
                    </button>

                    {showSecurityInfo && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                        <h5 className="mb-2 font-medium text-gray-700">How We Protect Your Vote</h5>
                        <ul className="space-y-1">
                          <li>• Your vote is encrypted and anonymized</li>
                          <li>• No connection between your identity and your vote is stored</li>
                          <li>• The system uses blockchain technology to prevent tampering</li>
                          <li>
                            • You will receive a verification receipt that you can use to verify your vote was counted
                          </li>
                          <li>• Independent auditors verify the integrity of the voting system</li>
                        </ul>
                      </div>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={submitVote}
                        disabled={!selectedCandidate || isVoting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 sm:w-auto"
                      >
                        {isVoting ? "Processing..." : "Submit Vote"}
                      </Button>
                    </div>
                  </>
                ) : (
                  // Vote submitted success
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-6">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-green-800">Vote Recorded Successfully</h3>
                      <p className="mt-2 text-center text-sm text-green-700">
                        Your vote has been securely recorded. Thank you for participating in the democratic process.
                      </p>

                      {/* Vote receipt */}
                      {voteReceipt && (
                        <div className="mt-4 w-full rounded-lg border border-green-200 bg-white p-4 text-sm">
                          <h4 className="mb-2 font-medium text-gray-800">Vote Receipt</h4>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between">
                              <span>Receipt ID:</span>
                              <span className="font-medium">{voteReceipt.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timestamp:</span>
                              <span className="font-medium">{new Date(voteReceipt.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Constituency:</span>
                              <span className="font-medium">{voteReceipt.constituency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Booth ID:</span>
                              <span className="font-medium">{voteReceipt.boothId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Verification Code:</span>
                              <span className="font-medium">{voteReceipt.verificationCode}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-center text-xs text-gray-500">
                            You can use this receipt to verify your vote was counted without revealing your choice.
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={returnToDashboard}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      >
                        Return to Dashboard
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="relative mt-4 flex flex-col space-y-2 border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
              <p className="flex items-center justify-center">
                <Shield className="mr-1 h-3 w-3 text-gray-400" />
                Your vote is confidential and securely processed
              </p>
              <p>
                Having trouble?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Contact election support
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Candidate details modal */}
        <Modal isOpen={showCandidateDetails} onClose={() => setShowCandidateDetails(false)} title="Candidate Details">
          {selectedCandidateDetails && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <img
                    src={selectedCandidateDetails.image || "/placeholder.svg"}
                    alt={selectedCandidateDetails.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{selectedCandidateDetails.name}</h3>
                  <p className="text-gray-600">{selectedCandidateDetails.party}</p>
                  <div className="mt-1 text-3xl">{selectedCandidateDetails.symbol}</div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <span className="font-medium text-gray-700">Age: </span>
                  <span>{selectedCandidateDetails.details.age} years</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Education: </span>
                  <span>{selectedCandidateDetails.details.education}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience: </span>
                  <span>{selectedCandidateDetails.details.experience}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-800">Key Manifesto Points:</h4>
                <ul className="list-inside list-disc space-y-1 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                  {selectedCandidateDetails.details.manifesto.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowCandidateDetails(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    selectCandidate(selectedCandidateDetails)
                    setShowCandidateDetails(false)
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-white ${selectedCandidateDetails.buttonColor}`}
                >
                  Select Candidate
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Confirmation modal */}
        <Modal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} title="Confirm Your Vote">
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <div className="flex items-start">
                  <Info className="mr-2 h-5 w-5 flex-shrink-0 text-yellow-600" />
                  <p>
                    You are about to cast your vote for <strong>{selectedCandidate.name}</strong> of{" "}
                    <strong>{selectedCandidate.party}</strong>. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4">
                <div className="text-3xl">{selectedCandidate.symbol}</div>
                <div>
                  <h3 className="font-medium">{selectedCandidate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCandidate.party}</p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Please confirm that this is your intended choice. Once submitted, your vote cannot be changed.
              </p>

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmVote}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Confirm Vote
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add custom CSS for animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
              70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
              100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
            }
            
            .pulse {
              animation: pulse 2s infinite;
            }
          `,
          }}
        />
      </div>
    </div>
  )
}

