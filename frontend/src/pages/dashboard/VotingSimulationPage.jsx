"use client"

import React, { useState } from "react"
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
  QrCode,
  ThumbsUp,
  Upload,
  Vote,
} from "lucide-react"

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

export default function VotingSimulationPage() {
  const [step, setStep] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Add this state for QR code upload
  const [uploadedQrCode, setUploadedQrCode] = useState(null)
  const [showQrUploader, setShowQrUploader] = useState(false)

  // Mock candidates data
  const candidates = [
    { id: 1, name: "Candidate A", party: "Party X", symbol: "🌟" },
    { id: 2, name: "Candidate B", party: "Party Y", symbol: "🌱" },
    { id: 3, name: "Candidate C", party: "Party Z", symbol: "🔔" },
    { id: 4, name: "Candidate D", party: "Party W", symbol: "🌈" },
    { id: 5, name: "NOTA", party: "None of the Above", symbol: "❌" },
  ]

  // Function to handle candidate selection
  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidate(candidateId)
  }

  // Function to handle vote confirmation
  const handleConfirmVote = () => {
    setShowConfirmation(true)
  }

  // Function to handle vote submission
  const handleSubmitVote = () => {
    setVoteSubmitted(true)
    setShowConfirmation(false)
  }

  // Function to handle vote cancellation
  const handleCancelVote = () => {
    setShowConfirmation(false)
  }

  // Function to restart the simulation
  const handleRestartSimulation = () => {
    setStep(1)
    setSelectedCandidate(null)
    setShowConfirmation(false)
    setVoteSubmitted(false)
  }

  // Function to go to next step
  const goToNextStep = () => {
    setStep(step + 1)
  }

  // Function to go to previous step
  const goToPreviousStep = () => {
    setStep(step - 1)
  }

  // Function to toggle help
  const toggleHelp = () => {
    setShowHelp(!showHelp)
  }

  // Add this function to handle QR code upload
  const handleQrUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, this would process the QR code image
      // For demo purposes, we'll just simulate a successful scan
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedQrCode(reader.result)
        // Simulate processing time
        setTimeout(() => {
          // After "processing" the QR code, move to step 2
          setStep(2)
          setShowQrUploader(false)
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voting Simulation</h1>
            <p className="text-gray-500">Experience the electronic voting process</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={toggleHelp}>
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <div className="h-2 w-24 rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {step === 1 && "Verification"}
            {step === 2 && "Candidate Selection"}
            {step === 3 && "Confirmation"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50" />

        {/* Step 1: Verification */}
        {step === 1 && (
          <>
            <CardHeader className="relative border-b border-gray-100 pb-4">
              <CardTitle>Voter Verification</CardTitle>
              <CardDescription>Verify your identity before voting</CardDescription>
            </CardHeader>
            <CardContent className="relative p-6">
              {showQrUploader && (
                <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <QrCode className="h-16 w-16 text-gray-400" />
                    <div className="text-center">
                      <h4 className="text-lg font-medium text-gray-700">Upload Your QR Code</h4>
                      <p className="mt-1 text-sm text-gray-500">Scan your voter QR code to verify your identity</p>
                    </div>

                    {uploadedQrCode ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={uploadedQrCode || "/placeholder.svg"}
                          alt="Uploaded QR Code"
                          className="h-48 w-48 object-contain"
                        />
                        <div className="mt-4 flex items-center text-green-600">
                          <Check className="mr-1 h-5 w-5" />
                          <span>QR Code detected! Processing...</span>
                        </div>
                      </div>
                    ) : (
                      <label className="mt-4 flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Upload className="mr-2 h-4 w-4" />
                        Select QR Code
                        <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} />
                      </label>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                  <Vote className="h-12 w-12 text-blue-600" />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Welcome to the Voting Simulation</h3>
                  <p className="mt-2 text-gray-600">
                    This simulation will guide you through the electronic voting process. In a real election, your
                    identity would be verified using your Voter ID and biometric authentication.
                  </p>
                </div>

                <div className="w-full max-w-md rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Simulation Note</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        For this simulation, we'll assume your identity has been verified. Click "Next" to proceed to
                        the candidate selection screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => setShowQrUploader(!showQrUploader)}>
                  {showQrUploader ? "Hide QR Scanner" : "Scan QR Code"}
                  <QrCode className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="relative border-t border-gray-100 p-4">
              <div className="flex w-full justify-end">
                <Button onClick={goToNextStep}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </>
        )}

        {/* Step 2: Candidate Selection */}
        {step === 2 && (
          <>
            <CardHeader className="relative border-b border-gray-100 pb-4">
              <CardTitle>Select Your Candidate</CardTitle>
              <CardDescription>Choose one candidate from the list</CardDescription>
            </CardHeader>
            <CardContent className="relative p-6">
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50 ${
                      selectedCandidate === candidate.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => handleCandidateSelect(candidate.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        {candidate.symbol}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">{candidate.party}</p>
                      </div>
                    </div>

                    {selectedCandidate === candidate.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="relative border-t border-gray-100 p-4">
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={goToNextStep} disabled={selectedCandidate === null}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && !voteSubmitted && (
          <>
            <CardHeader className="relative border-b border-gray-100 pb-4">
              <CardTitle>Confirm Your Vote</CardTitle>
              <CardDescription>Review and confirm your selection</CardDescription>
            </CardHeader>
            <CardContent className="relative p-6">
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="w-full max-w-md rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-4 text-center text-lg font-medium text-gray-900">Your Selection</h4>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                      {candidates.find((c) => c.id === selectedCandidate)?.symbol}
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900">
                        {candidates.find((c) => c.id === selectedCandidate)?.name}
                      </h4>
                      <p className="text-gray-500">{candidates.find((c) => c.id === selectedCandidate)?.party}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-md rounded-lg bg-yellow-50 p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        Once you confirm your vote, it cannot be changed. Please review your selection carefully before
                        confirming.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleConfirmVote}
                >
                  Confirm Vote
                </Button>
              </div>
            </CardContent>
            <CardFooter className="relative border-t border-gray-100 p-4">
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardFooter>
          </>
        )}

        {/* Vote Submitted */}
        {voteSubmitted && (
          <>
            <CardHeader className="relative border-b border-gray-100 pb-4">
              <CardTitle>Vote Submitted</CardTitle>
              <CardDescription>Your vote has been recorded</CardDescription>
            </CardHeader>
            <CardContent className="relative p-6">
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                  <ThumbsUp className="h-12 w-12 text-green-600" />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Thank You for Voting!</h3>
                  <p className="mt-2 text-gray-600">
                    Your vote has been successfully recorded. In a real election, you would receive a verification slip
                    as proof of your vote.
                  </p>
                </div>

                <div className="w-full max-w-md rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Simulation Complete</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        This completes the voting simulation. You can restart the simulation to try again or explore
                        other features of the application.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="lg" className="w-full max-w-xs" onClick={handleRestartSimulation}>
                  Restart Simulation
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">Confirm Your Vote</h3>
              <p className="mt-2 text-gray-600">Are you sure you want to vote for:</p>

              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  {candidates.find((c) => c.id === selectedCandidate)?.symbol}
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900">
                    {candidates.find((c) => c.id === selectedCandidate)?.name}
                  </h4>
                  <p className="text-gray-500">{candidates.find((c) => c.id === selectedCandidate)?.party}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <Button variant="outline" className="w-1/2" onClick={handleCancelVote}>
                Cancel
              </Button>
              <Button
                className="w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleSubmitVote}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Voting Help</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={toggleHelp}>
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

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">How to Vote</h4>
                <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-gray-600">
                  <li>Verify your identity using your Voter ID and biometric authentication.</li>
                  <li>Select your preferred candidate by clicking on their name.</li>
                  <li>Review your selection and confirm your vote.</li>
                  <li>Receive a verification slip as proof of your vote.</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Important Notes</h4>
                <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-gray-600">
                  <li>Your vote is confidential and cannot be traced back to you.</li>
                  <li>You can only vote once in an election.</li>
                  <li>If you face any issues, please contact the polling station officials.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" onClick={toggleHelp}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

