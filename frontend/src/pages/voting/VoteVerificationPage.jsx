"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as faceapi from "face-api.js"
import { AlertCircle, Camera, Check, ChevronRight, Lock, Shield, Smartphone } from "lucide-react"

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

// Progress component
const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export default function VoteVerificationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Number verification, 2: Facial recognition
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [verificationNumbers, setVerificationNumbers] = useState([])
  const [correctNumber, setCorrectNumber] = useState(null)
  const [numberVerified, setNumberVerified] = useState(false)
  const [faceVerified, setFaceVerified] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraPermission, setCameraPermission] = useState(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [detectionInterval, setDetectionInterval] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Load user data from session storage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData")
    if (!storedUserData) {
      navigate("/dashboard")
      return
    }

    try {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)

      // Generate verification numbers
      generateVerificationNumbers()
    } catch (error) {
      console.error("Error parsing user data:", error)
      navigate("/dashboard")
    }

    // Load face-api models when component mounts
    loadFaceApiModels()

    // Clean up on unmount
    return () => {
      stopCamera()
      if (detectionInterval) {
        clearInterval(detectionInterval)
      }
    }
  }, [navigate])

  // Generate 3 random 2-digit numbers for verification
  const generateVerificationNumbers = () => {
    const numbers = []
    for (let i = 0; i < 3; i++) {
      numbers.push(Math.floor(10 + Math.random() * 90)) // 2-digit numbers (10-99)
    }
    setVerificationNumbers(numbers)

    // Set one of them as the correct number
    const correctIndex = Math.floor(Math.random() * 3)
    setCorrectNumber(numbers[correctIndex])

    // In a real app, this would send an SMS to the user's phone
    console.log(`Correct verification number: ${numbers[correctIndex]}`)
  }

  // Handle number verification
  const verifyNumber = (selectedNumber) => {
    if (selectedNumber === correctNumber) {
      setNumberVerified(true)
      setStep(2)
    } else {
      setError("Incorrect number selected. Please try again.")
      // Generate new numbers
      generateVerificationNumbers()
    }
  }

  // Load face-api models
  const loadFaceApiModels = async () => {
    setIsModelLoading(true)
    try {
      // Set the models path
      const MODEL_URL = "/models"

      // Load the required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ])

      console.log("Face-API models loaded successfully")
      setModelsLoaded(true)
    } catch (error) {
      console.error("Error loading face-api models:", error)
      setError("Failed to load facial recognition models. Please try again.")
    } finally {
      setIsModelLoading(false)
    }
  }

  // Start camera for facial recognition
  const startCamera = async () => {
    if (!modelsLoaded) {
      setError("Face recognition models are not loaded yet. Please wait.")
      return
    }

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        setCameraPermission(true)

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()

          // Start face detection
          startFaceDetection()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraPermission(false)
      setError("Camera access denied. Please allow camera access to continue.")
    }
  }

  // Start face detection interval
  const startFaceDetection = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval)
    }

    // Run face detection every 100ms
    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current && isCameraActive) {
        await detectFace()
      }
    }, 100)

    setDetectionInterval(interval)
  }

  // Detect face in video
  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return

    try {
      // Detect face
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      // Draw results on canvas
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
      faceapi.matchDimensions(canvasRef.current, displaySize)

      if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const ctx = canvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Draw face detection
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

        // Draw face landmarks
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
      }
    } catch (error) {
      console.error("Error during face detection:", error)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)

    if (detectionInterval) {
      clearInterval(detectionInterval)
      setDetectionInterval(null)
    }
  }

  // Capture and verify face
  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      setError("Camera is not active. Please start the camera first.")
      return
    }

    setIsLoading(true)
    try {
      // Detect face in the current video frame
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detections) {
        setError("No face detected. Please ensure your face is clearly visible.")
        setIsLoading(false)
        return
      }

      // Draw the detection on the canvas for visual feedback
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height }
      faceapi.matchDimensions(canvasRef.current, displaySize)

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)

      // In a real app, you would compare the face descriptor with the stored one
      // For demo purposes, we'll simulate a successful match after a delay
      setTimeout(() => {
        setFaceVerified(true)
        stopCamera()
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error during facial verification:", error)
      setError("Facial verification failed. Please try again.")
      setIsLoading(false)
    }
  }

  // Proceed to voting page
  const proceedToVoting = () => {
    // Set a flag in session storage to indicate the user has been verified
    sessionStorage.setItem("voteVerified", "true")
    navigate("/voting/cast-vote")
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
              Vote Verification
            </span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 2: {step === 1 ? "Number Verification" : "Facial Recognition"}
          </p>
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
                  {step === 1 ? <Lock className="h-5 w-5 text-white" /> : <Camera className="h-5 w-5 text-white" />}
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500">Step {step} of 2</span>
                </div>
              </div>
              <CardTitle className="mt-4 text-xl font-bold">
                {step === 1 ? "Number Verification" : "Facial Recognition"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Select the number that was sent to your registered mobile"
                  : "Verify your identity with facial recognition"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative px-6 pt-6">
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Number Verification</span>
                    <span>Facial Recognition</span>
                  </div>
                  <Progress value={step === 1 ? 50 : 100} className="h-2" />
                </div>

                {/* Step 1: Number Verification */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-start space-x-3">
                        <Smartphone className="mt-0.5 h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Verification Code</h4>
                          <p className="mt-1 text-xs text-blue-700">
                            A verification code has been sent to your registered mobile number. Select the correct
                            number below.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {verificationNumbers.map((number, index) => (
                        <button
                          key={index}
                          onClick={() => verifyNumber(number)}
                          className="flex h-16 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl font-semibold text-gray-800 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow"
                        >
                          {number}
                        </button>
                      ))}
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <div className="text-center text-xs text-gray-500">
                      <p>
                        Didn't receive the code?{" "}
                        <button
                          onClick={generateVerificationNumbers}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Resend Code
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Facial Recognition */}
                {step === 2 && (
                  <div className="space-y-4">
                    {!faceVerified ? (
                      <>
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                          <div className="flex items-start space-x-3">
                            <Camera className="mt-0.5 h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Facial Recognition</h4>
                              <p className="mt-1 text-xs text-blue-700">
                                Please allow camera access and position your face within the frame. Your face will be
                                matched with your Aadhaar photo for verification.
                              </p>
                            </div>
                          </div>
                        </div>

                        {isModelLoading && (
                          <div className="flex flex-col items-center justify-center py-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading facial recognition models...</p>
                          </div>
                        )}

                        <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-black">
                          {isCameraActive ? (
                            <>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="h-full w-full object-cover"
                                width={640}
                                height={480}
                              />
                              <canvas
                                ref={canvasRef}
                                className="absolute inset-0 h-full w-full object-cover"
                                width={640}
                                height={480}
                              />
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <div className="flex flex-col items-center space-y-2 text-white">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                                    <span className="text-sm">Verifying...</span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-white">
                              {cameraPermission === false ? (
                                <div className="text-center">
                                  <AlertCircle className="mx-auto mb-2 h-10 w-10 text-red-500" />
                                  <p className="text-sm">
                                    Camera access denied. Please allow camera access in your browser settings.
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Camera className="mb-2 h-10 w-10 text-gray-400" />
                                  <p className="text-center text-sm text-gray-400">
                                    Click the button below to start camera
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {error && (
                          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                            {error}
                          </div>
                        )}

                        <div className="flex justify-center space-x-4">
                          {!isCameraActive ? (
                            <Button
                              onClick={startCamera}
                              disabled={isLoading || cameraPermission === false || isModelLoading}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                            >
                              {isModelLoading ? "Loading Models..." : "Start Camera"}
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={stopCamera}
                                variant="outline"
                                disabled={isLoading}
                                className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={captureFace}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                              >
                                Verify Face
                              </Button>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-6">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-medium text-green-800">Facial Recognition Successful</h3>
                          <p className="mt-2 text-center text-sm text-green-700">
                            Your identity has been verified successfully. You can now proceed to the voting page.
                          </p>
                        </div>

                        <Button
                          onClick={proceedToVoting}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        >
                          Proceed to Voting
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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

