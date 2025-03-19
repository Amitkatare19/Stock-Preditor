"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as faceapi from "face-api.js"
import {
  AlertCircle,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Fingerprint,
  HelpCircle,
  Lock,
  Shield,
  Smartphone,
  User,
  RefreshCw,
  Zap,
} from "lucide-react"

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

// Tooltip component
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
          {content}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800"></div>
        </div>
      )}
    </div>
  )
}

// Step indicator component
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-1 items-center">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              index < currentStep
                ? "bg-green-100 text-green-700"
                : index === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400",
            )}
          >
            {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-1 flex-1",
                index < currentStep
                  ? "bg-green-400"
                  : index === currentStep
                    ? "bg-gradient-to-r from-blue-600 to-gray-200"
                    : "bg-gray-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Simple face detection using canvas API
const SimpleFaceDetector = {
  // Detect face using simple color-based detection (for demo purposes)
  detectFace: (videoEl, canvasEl) => {
    if (!videoEl || !canvasEl) return false

    try {
      const ctx = canvasEl.getContext("2d")
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height)

      // Get image data from the center of the frame where a face would likely be
      const centerX = canvasEl.width / 2
      const centerY = canvasEl.height / 2
      const sampleSize = Math.min(canvasEl.width, canvasEl.height) * 0.5 // 50% of the smaller dimension

      const imageData = ctx.getImageData(centerX - sampleSize / 2, centerY - sampleSize / 2, sampleSize, sampleSize)

      // Simple algorithm to detect skin-like colors
      let skinPixels = 0
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // More lenient skin tone detection
        if (r > 50 && g > 30 && b > 20 && r > g && r > b) {
          skinPixels++
        }
      }

      // Calculate percentage of skin-like pixels
      const totalPixels = sampleSize * sampleSize
      const skinPercentage = (skinPixels / totalPixels) * 100

      // Draw a face detection overlay - more lenient threshold
      if (skinPercentage > 5) {
        // Lower threshold for detection
        // Draw face detection box
        const boxSize = sampleSize * 1.5
        ctx.strokeStyle = "#4f46e5"
        ctx.lineWidth = 3
        ctx.strokeRect(centerX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize)

        // Add label
        ctx.fillStyle = "rgba(79, 70, 229, 0.8)"
        ctx.fillRect(centerX - boxSize / 2, centerY - boxSize / 2 - 25, 120, 25)
        ctx.fillStyle = "white"
        ctx.font = "bold 14px Arial"
        ctx.fillText("Face Detected", centerX - boxSize / 2 + 10, centerY - boxSize / 2 - 8)

        return true
      }

      return false
    } catch (error) {
      console.error("Error in simple face detection:", error)
      return false
    }
  },

  // Draw verification overlay
  drawVerificationOverlay: (canvasEl) => {
    if (!canvasEl) return

    const ctx = canvasEl.getContext("2d")
    const centerX = canvasEl.width / 2
    const centerY = canvasEl.height / 2
    const boxSize = 200

    // Clear canvas
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

    // Draw verification overlay
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)

    // Draw scanning animation
    const scanLineY = ((Date.now() % 2000) / 2000) * canvasEl.height
    ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, scanLineY)
    ctx.lineTo(canvasEl.width, scanLineY)
    ctx.stroke()

    // Draw face detection box
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.strokeRect(centerX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize)

    // Add verification text
    ctx.fillStyle = "rgba(16, 185, 129, 0.8)"
    ctx.fillRect(centerX - boxSize / 2, centerY - boxSize / 2 - 30, 120, 25)
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Arial"
    ctx.fillText("Verifying...", centerX - boxSize / 2 + 10, centerY - boxSize / 2 - 12)

    // Draw facial landmarks (simplified)
    const drawLandmark = (x, y) => {
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = "#10b981"
      ctx.fill()
    }

    // Draw simplified face landmarks
    // Eyes
    drawLandmark(centerX - 30, centerY - 20)
    drawLandmark(centerX + 30, centerY - 20)

    // Nose
    drawLandmark(centerX, centerY)

    // Mouth
    drawLandmark(centerX - 20, centerY + 30)
    drawLandmark(centerX, centerY + 35)
    drawLandmark(centerX + 20, centerY + 30)
  },
}

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
  const [modelLoadingError, setModelLoadingError] = useState(null)
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [useAlternativeVerification, setUseAlternativeVerification] = useState(false)
  const [pinCode, setPinCode] = useState("")
  const [pinSent, setPinSent] = useState(false)
  const [securityQuestions, setSecurityQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [questionVerified, setQuestionVerified] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [verificationStep, setVerificationStep] = useState(1) // 1: Security Question, 2: OTP
  const [showHelp, setShowHelp] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes in seconds
  const [otpTimerActive, setOtpTimerActive] = useState(false)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [useSimpleFaceDetection, setUseSimpleFaceDetection] = useState(false)
  const [faceDetectionMode, setFaceDetectionMode] = useState("advanced") // 'advanced' or 'simple'
  const [faceDetectionQuality, setFaceDetectionQuality] = useState(0) // 0-100
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const [faceVerificationStage, setFaceVerificationStage] = useState(0) // 0: not started, 1: aligning, 2: capturing, 3: analyzing
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === "development")

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const animationRef = useRef(null)

  // For debugging
  useEffect(() => {
    console.log("Component mounted")

    // Check if navigator.mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser")
      setError("Camera access is not supported in this browser. Please try a different browser.")
      return
    }

    // Log available devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        console.log("Available video devices:", videoDevices.length)
      })
      .catch((err) => {
        console.error("Error enumerating devices:", err)
      })
  }, [])

  // OTP timer effect
  useEffect(() => {
    if (otpTimerActive && otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0) {
      setOtpSent(false)
      setError("OTP has expired. Please request a new one.")
      setOtpTimerActive(false)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [otpTimerActive, otpTimer])

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Load user data from session storage or use mock data for testing
  useEffect(() => {
    try {
      const storedUserData = sessionStorage.getItem("userData")

      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData)
        setUserData(parsedUserData)
      } else {
        // For testing: Create mock user data if none exists
        const mockUserData = {
          name: "Rahul Sharma",
          aadhaarNumber: "1234 5678 9012",
          phoneNumber: "9876543210", // Ensure this is always set
          voterID: "ABC1234567",
          constituency: "Central Delhi",
          address: "123 Main Street, New Delhi",
          dateOfBirth: "1985-05-15",
        }
        sessionStorage.setItem("userData", JSON.stringify(mockUserData))
        setUserData(mockUserData)
        console.log("Created mock user data for testing")
      }

      // Generate verification numbers
      generateVerificationNumbers()

      // Start with simple face detection by default - more reliable
      setFaceDetectionMode("simple")
      setModelsLoaded(true)

      // Only try to load face-api models if WebGL is supported
      if (checkWebGLSupport()) {
        loadFaceApiModels()
      } else {
        console.log("WebGL not supported, using simple face detection")
        setUseSimpleFaceDetection(true)
      }

      // Clean up on unmount
      return () => {
        stopCamera()
        if (detectionInterval) {
          clearInterval(detectionInterval)
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } catch (error) {
      console.error("Error handling user data:", error)
      setError("Error loading user data. Please return to dashboard and try again.")
    }
  }, [])

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

  // Add this function to check WebGL support
  const checkWebGLSupport = () => {
    try {
      // Try to create a WebGL context
      const canvas = document.createElement("canvas")

      // Try WebGL2 first
      let gl = canvas.getContext("webgl2")

      // Fall back to WebGL1
      if (!gl) {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      }

      if (!gl) {
        console.error("WebGL is not supported in this browser")
        setWebGLSupported(false)
        return false
      }

      // Additional check for WebGL capabilities
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        console.log("WebGL Renderer:", renderer)

        // Check if using software renderer (SwiftShader, ANGLE, etc.)
        if (renderer.includes("SwiftShader") || renderer.includes("Software")) {
          console.warn("Using software WebGL renderer which may have limited capabilities")
          // Software renderers often have issues with face-api.js, so we'll use simple detection
          setUseSimpleFaceDetection(true)
          return true
        }
      }

      return true
    } catch (e) {
      console.error("Error checking WebGL support:", e)
      setWebGLSupported(false)
      return false
    }
  }

  // Load face-api models
  const loadFaceApiModels = async () => {
    setIsModelLoading(true)
    setModelLoadingError(null)

    // First check if WebGL is supported
    if (!checkWebGLSupport()) {
      console.log("WebGL is not supported, switching to alternative verification")
      setModelLoadingError("WebGL is not supported on this device. Using alternative verification method.")
      setIsModelLoading(false)
      setUseAlternativeVerification(true)
      return
    }

    // If we're using simple face detection, skip loading the models
    if (useSimpleFaceDetection) {
      console.log("Using simple face detection instead of face-api.js")
      setFaceDetectionMode("simple")
      setModelsLoaded(true)
      setIsModelLoading(false)
      return
    }

    try {
      console.log("Starting to load face-api models...")

      // Set the models path
      const MODEL_URL = "/models"

      // Add a function to validate model files before loading
      const validateModelFile = async (url) => {
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`Failed to fetch model file: ${response.status} ${response.statusText}`)
          }
          return true
        } catch (error) {
          console.error(`Model validation failed for ${url}:`, error)
          return false
        }
      }

      // Validate model files first
      const tinyFaceDetectorManifest = `${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`
      const faceLandmarkManifest = `${MODEL_URL}/face_landmark_68_model-weights_manifest.json`
      const faceRecognitionManifest = `${MODEL_URL}/face_recognition_model-weights_manifest.json`

      const [tinyFaceValid, faceLandmarkValid, faceRecognitionValid] = await Promise.all([
        validateModelFile(tinyFaceDetectorManifest),
        validateModelFile(faceLandmarkManifest),
        validateModelFile(faceRecognitionManifest),
      ])

      if (!tinyFaceValid || !faceLandmarkValid || !faceRecognitionValid) {
        console.log("Some model files are missing, falling back to simple face detection")
        setFaceDetectionMode("simple")
        setModelsLoaded(true)
        setIsModelLoading(false)
        return
      }

      // Try to load models with better error handling
      try {
        console.log("Loading tiny face detector model...")
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        console.log("Tiny face detector model loaded successfully")

        console.log("Loading face landmark model...")
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        console.log("Face landmark model loaded successfully")

        console.log("Loading face recognition model...")
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        console.log("Face recognition model loaded successfully")

        console.log("All face-API models loaded successfully")
        setFaceDetectionMode("advanced")
        setModelsLoaded(true)
      } catch (error) {
        console.error("Error loading models:", error)
        console.log("Falling back to simple face detection")
        setFaceDetectionMode("simple")
        setModelsLoaded(true)
      }
    } catch (error) {
      console.error("Error in loadFaceApiModels:", error)
      setModelLoadingError(error.message || "Failed to load facial recognition models")
      setError("Failed to load facial recognition models. Using simplified detection.")
      // Fall back to simple face detection
      setFaceDetectionMode("simple")
      setModelsLoaded(true)
    } finally {
      setIsModelLoading(false)
    }
  }

  // Start camera for facial recognition
  const startCamera = async () => {
    console.log("Starting camera...")
    setError(null)
    setIsLoading(true)

    try {
      console.log("Requesting camera permission...")

      // Request camera permission with more flexible constraints
      const constraints = {
        video: {
          facingMode: "user",
        },
        audio: false,
      }

      console.log("Camera constraints:", constraints)

      // First check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser. Please try a different browser.")
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Camera permission granted, stream obtained")

      if (!videoRef.current) {
        throw new Error("Video element not found. Please reload the page.")
      }

      // Set up video element
      videoRef.current.srcObject = stream
      streamRef.current = stream
      videoRef.current.muted = true
      videoRef.current.playsInline = true

      // Wait for video to be ready
      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded, playing video")
        videoRef.current
          .play()
          .then(() => {
            console.log("Video playing successfully")
            setIsCameraActive(true)
            setCameraPermission(true)
            setIsLoading(false)

            // Set canvas dimensions to match video
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth || 640
              canvasRef.current.height = videoRef.current.videoHeight || 480
            }

            // Start face detection
            startFaceDetection()
          })
          .catch((err) => {
            console.error("Error playing video:", err)
            setError(`Error playing video: ${err.message}. Try reloading the page.`)
            setIsLoading(false)
          })
      }

      videoRef.current.onerror = (err) => {
        console.error("Video element error:", err)
        setError(`Video element error: ${err}`)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraPermission(false)
      setIsLoading(false)

      if (error.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera access in your browser settings and reload the page.")
      } else if (error.name === "NotFoundError") {
        setError("No camera found. Please connect a camera and try again.")
      } else if (error.name === "NotReadableError") {
        setError("Camera is already in use by another application. Please close other applications using the camera.")
      } else if (error.name === "OverconstrainedError") {
        // Try again with less constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            streamRef.current = stream
            videoRef.current
              .play()
              .then(() => {
                setIsCameraActive(true)
                setCameraPermission(true)
                setIsLoading(false)
                startFaceDetection()
              })
              .catch((err) => {
                setError(`Failed to play video: ${err.message}`)
                setIsLoading(false)
              })
          }
        } catch (fallbackError) {
          setError(`Camera error: Could not access any camera. ${fallbackError.message}`)
          setIsLoading(false)
        }
      } else {
        setError(`Camera error: ${error.message || "Unknown error"}. Please try a different browser.`)
      }
    }
  }

  // Start face detection interval
  const startFaceDetection = () => {
    console.log("Starting face detection with mode:", faceDetectionMode)

    if (detectionInterval) {
      clearInterval(detectionInterval)
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Use requestAnimationFrame for smoother detection
    const detectFrame = () => {
      if (videoRef.current && canvasRef.current && isCameraActive) {
        if (faceDetectionMode === "simple") {
          // Use simple face detection
          const detected = SimpleFaceDetector.detectFace(videoRef.current, canvasRef.current)
          setFaceDetected(detected)

          // Update face detection quality (simulated)
          if (detected) {
            setFaceDetectionQuality((prev) => Math.min(100, prev + 2))
          } else {
            setFaceDetectionQuality((prev) => Math.max(0, prev - 5))
          }
        } else {
          // Use face-api.js
          detectFace()
        }
      }
      animationRef.current = requestAnimationFrame(detectFrame)
    }

    detectFrame()
  }

  // Detect face in video using face-api.js
  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return

    try {
      // Detect face
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      // Draw results on canvas
      const displaySize = {
        width: videoRef.current.videoWidth || videoRef.current.width,
        height: videoRef.current.videoHeight || videoRef.current.height,
      }

      // Ensure canvas dimensions match video
      if (canvasRef.current.width !== displaySize.width || canvasRef.current.height !== displaySize.height) {
        canvasRef.current.width = displaySize.width
        canvasRef.current.height = displaySize.height
      }

      faceapi.matchDimensions(canvasRef.current, displaySize)

      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      if (detections) {
        console.log("Face detected:", detections)
        setFaceDetected(true)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // Draw face detection with custom styling
        ctx.strokeStyle = "#4f46e5"
        ctx.lineWidth = 2

        // Draw detection box
        const { _box: box } = resizedDetections.detection
        ctx.strokeRect(box._x, box._y, box._width, box._height)

        // Add a label
        ctx.fillStyle = "rgba(79, 70, 229, 0.8)"
        ctx.fillRect(box._x, box._y - 20, 80, 20)
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.fillText("Face Detected", box._x + 5, box._y - 5)

        // Draw face landmarks with custom styling
        const landmarks = resizedDetections.landmarks.positions

        // Draw all landmarks
        ctx.fillStyle = "#10b981"
        landmarks.forEach((point) => {
          ctx.beginPath()
          ctx.arc(point._x, point._y, 2, 0, 2 * Math.PI)
          ctx.fill()
        })

        // Connect landmarks for eyes
        const leftEye = landmarks.slice(36, 42)
        const rightEye = landmarks.slice(42, 48)

        ctx.strokeStyle = "#10b981"
        ctx.beginPath()
        leftEye.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point._x, point._y)
          else ctx.lineTo(point._x, point._y)
        })
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        rightEye.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point._x, point._y)
          else ctx.lineTo(point._x, point._y)
        })
        ctx.closePath()
        ctx.stroke()

        // Update face detection quality based on detection confidence
        setFaceDetectionQuality(resizedDetections.detection._score * 100)
      } else {
        setFaceDetected(false)
        setFaceDetectionQuality((prev) => Math.max(0, prev - 5))
      }
    } catch (error) {
      console.error("Error during face detection:", error)
      // If face-api.js fails, try to fall back to simple detection
      if (faceDetectionMode === "advanced") {
        console.log("Falling back to simple face detection")
        setFaceDetectionMode("simple")
      }
    }
  }

  // Stop camera
  const stopCamera = () => {
    console.log("Stopping camera")

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("Stopping track:", track)
        track.stop()
      })
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

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  // Capture and verify face
  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      setError("Camera is not active. Please start the camera first.")
      return
    }

    if (!faceDetected) {
      setError("No face detected. Please ensure your face is clearly visible.")
      return
    }

    setIsLoading(true)
    setFaceVerificationStage(1) // Aligning

    try {
      console.log("Capturing face for verification")

      // Start the verification process
      setTimeout(() => {
        setFaceVerificationStage(2) // Capturing

        // Simulate multiple captures for better verification
        let captures = 0
        const captureInterval = setInterval(() => {
          captures++
          setCaptureCount(captures)

          if (captures >= 3) {
            clearInterval(captureInterval)
            setFaceVerificationStage(3) // Analyzing

            // Draw verification overlay
            if (faceDetectionMode === "simple") {
              SimpleFaceDetector.drawVerificationOverlay(canvasRef.current)
            } else {
              // Use face-api.js for advanced verification
              verifyWithFaceApi()
            }

            // Simulate verification progress
            let progress = 0
            const progressInterval = setInterval(() => {
              progress += 5
              setVerificationProgress(progress)

              if (progress >= 100) {
                clearInterval(progressInterval)
                setFaceVerified(true)
                stopCamera()
                setIsLoading(false)
              }
            }, 100)
          }
        }, 800)
      }, 1000)
    } catch (error) {
      console.error("Error during facial verification:", error)
      setError(`Facial verification failed: ${error.message || "Unknown error"}`)
      setIsLoading(false)
      setFaceVerificationStage(0)
    }
  }

  // Verify with face-api.js
  const verifyWithFaceApi = async () => {
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

      console.log("Face detected for verification:", detections)

      // Draw the detection on the canvas for visual feedback
      const displaySize = {
        width: videoRef.current.videoWidth || videoRef.current.width,
        height: videoRef.current.videoHeight || videoRef.current.height,
      }
      faceapi.matchDimensions(canvasRef.current, displaySize)

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Draw a custom verification overlay
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Draw a scanning line animation
      const scanLineY = ((Date.now() % 2000) / 2000) * canvasRef.current.height
      ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, scanLineY)
      ctx.lineTo(canvasRef.current.width, scanLineY)
      ctx.stroke()

      // Draw face detection box
      const { _box: box } = resizedDetections.detection
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
      ctx.strokeRect(box._x, box._y, box._width, box._height)

      // Add verification text
      ctx.fillStyle = "rgba(16, 185, 129, 0.8)"
      ctx.fillRect(box._x, box._y - 30, 120, 25)
      ctx.fillStyle = "white"
      ctx.font = "bold 14px Arial"
      ctx.fillText("Verifying...", box._x + 10, box._y - 12)
    } catch (error) {
      console.error("Error in face-api verification:", error)
      // Fall back to simple verification
      SimpleFaceDetector.drawVerificationOverlay(canvasRef.current)
    }
  }

  // Proceed to voting page
  const proceedToVoting = () => {
    // Set a flag in session storage to indicate the user has been verified
    sessionStorage.setItem("voteVerified", "true")
    navigate("/voting/cast-vote")
  }

  // For testing: Skip verification (only for development)
  const skipVerification = () => {
    if (process.env.NODE_ENV === "development") {
      setFaceVerified(true)
      console.log("Verification skipped (development mode)")
    }
  }

  // Retry loading models
  const retryLoadModels = () => {
    loadFaceApiModels()
  }

  // Switch face detection mode
  const switchFaceDetectionMode = () => {
    const newMode = faceDetectionMode === "advanced" ? "simple" : "advanced"
    console.log(`Switching face detection mode to: ${newMode}`)
    setFaceDetectionMode(newMode)

    // Restart face detection with new mode
    if (isCameraActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startFaceDetection()
    }
  }

  // Add a new function for alternative verification
  const useAlternativeVerificationMethod = () => {
    setUseAlternativeVerification(true)
    loadSecurityQuestions()
  }

  // Generate a random 4-digit PIN
  const generatePIN = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    setPinCode(pin)
    setPinSent(true)
    console.log(`PIN generated for verification: ${pin}`)
    return pin
  }

  // Send PIN to user's phone (simulated)
  const sendPIN = () => {
    setError(null)
    const pin = generatePIN()
    // In a real app, this would send the PIN to the user's phone
    // For demo purposes, we'll just show it in the console
    console.log(`PIN sent to user's phone: ${pin}`)
    return true
  }

  // Verify PIN
  const verifyPIN = (event) => {
    event.preventDefault()
    setError(null)

    const enteredPin = event.target.elements.pin.value

    // In a real app, you would verify this PIN against the one sent to the user
    // For demo purposes, we'll accept the correct PIN or any 4-digit PIN if we're in development mode
    if (process.env.NODE_ENV === "development" && enteredPin.length === 4 && /^\d+$/.test(enteredPin)) {
      setFaceVerified(true)
      return
    }

    if (enteredPin === pinCode) {
      setFaceVerified(true)
    } else {
      setError("Incorrect PIN. Please try again.")
    }
  }

  // Load security questions for the user
  const loadSecurityQuestions = () => {
    // In a real app, these would be fetched from the user's profile
    // For demo purposes, we'll use some sample questions
    const questions = [
      {
        id: 1,
        question: "What was the name of your first pet?",
        answer: "fluffy", // In a real app, this would be hashed and stored securely
      },
      {
        id: 2,
        question: "In which city were you born?",
        answer: "mumbai",
      },
      {
        id: 3,
        question: "What was the model of your first car?",
        answer: "swift",
      },
      {
        id: 4,
        question: "What is your mother's maiden name?",
        answer: "patel",
      },
      {
        id: 5,
        question: "What was the name of your primary school?",
        answer: "st. mary",
      },
    ]

    setSecurityQuestions(questions)

    // Select a random question
    const randomIndex = Math.floor(Math.random() * questions.length)
    setSelectedQuestion(questions[randomIndex])
  }

  // Verify security question answer
  const verifySecurityAnswer = (event) => {
    event.preventDefault()
    setError(null)

    // In a real app, you would hash the answer and compare with the stored hash
    // For demo purposes, we'll do a case-insensitive comparison
    if (securityAnswer.toLowerCase() === selectedQuestion.answer.toLowerCase()) {
      setQuestionVerified(true)
      setVerificationStep(2)
      // Send OTP after question is verified
      sendOTP()
    } else {
      setError("Incorrect answer. Please try again.")
    }
  }

  // Generate and send OTP
  const sendOTP = () => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(otp)
    setOtpSent(true)
    setOtpTimer(300) // Reset timer to 5 minutes
    setOtpTimerActive(true)

    // In a real app, this would send the OTP to the user's phone or email
    console.log(`OTP sent to user: ${otp}`)
  }

  // Verify OTP
  const verifyOTP = (event) => {
    event.preventDefault()
    setError(null)

    const enteredOTP = event.target.elements.otp.value

    if (enteredOTP === otpCode) {
      setOtpVerified(true)
      setOtpTimerActive(false)
      setFaceVerified(true) // This will show the success screen
    } else {
      setError("Incorrect OTP. Please try again.")
    }
  }

  // Toggle help section
  const toggleHelp = () => {
    setShowHelp((prev) => !prev)
  }

  // Toggle security info
  const toggleSecurityInfo = () => {
    setShowSecurityInfo((prev) => !prev)
  }

  // Toggle troubleshooting section
  const toggleTroubleshooting = () => {
    setShowTroubleshooting((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vote Verification
            </span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure verification process for General Elections 2025
          </p>

          {/* User info summary */}
          {userData && (
            <div className="mt-4 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3 text-sm">
                <p className="font-medium text-gray-900">{userData.name}</p>
                <p className="text-gray-500">Voter ID: {userData.voterID}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-md">
          <StepIndicator steps={["Mobile Verification", "Identity Verification", "Vote"]} currentStep={step} />
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
                  {step === 1 ? (
                    <Smartphone className="h-5 w-5 text-white" />
                  ) : step === 2 ? (
                    <Fingerprint className="h-5 w-5 text-white" />
                  ) : (
                    <Check className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Step {step} of 2</span>
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
                {step === 1 ? "Mobile Verification" : "Identity Verification"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Select the number that was sent to your registered mobile"
                  : "Verify your identity with facial recognition"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative px-6 pt-6">
              <div className="space-y-6">
                {/* Help section */}
                {showHelp && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
                    <h4 className="mb-2 font-medium text-blue-800">Verification Help</h4>
                    {step === 1 ? (
                      <div className="space-y-2 text-blue-700">
                        <p>• A verification code has been sent to your registered mobile number.</p>
                        <p>• Select the correct number from the options below.</p>
                        <p>• If you didn't receive the code, you can request a new one.</p>
                        <p>• This step ensures that you have access to your registered mobile device.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-blue-700">
                        <p>• Position your face clearly in the camera frame.</p>
                        <p>• Ensure good lighting and remove any face coverings.</p>
                        <p>• If facial recognition doesn't work, you can use the alternative verification method.</p>
                        <p>• This step confirms your identity before allowing you to vote.</p>
                      </div>
                    )}
                    <button onClick={toggleHelp} className="mt-2 text-blue-600 hover:text-blue-800 hover:underline">
                      Close Help
                    </button>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Mobile Verification</span>
                    <span>Identity Verification</span>
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
                            A verification code has been sent to your registered mobile number ending in
                            <span className="font-medium">
                              {" "}
                              {userData?.phoneNumber ? userData.phoneNumber.slice(-4) : "****"}
                            </span>
                            . Select the correct number below.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {verificationNumbers.map((number, index) => (
                        <button
                          key={index}
                          onClick={() => verifyNumber(number)}
                          className="group relative flex h-16 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white text-xl font-semibold text-gray-800 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
                          <span className="relative">{number}</span>
                        </button>
                      ))}
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                        <AlertCircle className="mr-1 inline-block h-4 w-4" />
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

                    {/* Security information */}
                    <button
                      onClick={toggleSecurityInfo}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Security Information</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-gray-500 transition-transform ${showSecurityInfo ? "rotate-90" : ""}`}
                      />
                    </button>

                    {showSecurityInfo && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                        <h5 className="mb-2 font-medium text-gray-700">How We Protect Your Vote</h5>
                        <ul className="space-y-1">
                          <li>• All data is encrypted using industry-standard protocols</li>
                          <li>• Multi-factor authentication ensures only you can cast your vote</li>
                          <li>• Your vote is anonymized after verification</li>
                          <li>• Our system is regularly audited by independent security experts</li>
                          <li>• No personal data is stored with your voting record</li>
                        </ul>
                      </div>
                    )}

                    {/* For testing only - in development mode */}
                    {process.env.NODE_ENV === "development" && (
                      <div className="mt-4 text-center">
                        <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-600">
                          [DEV] Skip to facial recognition
                        </button>
                      </div>
                    )}
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
                              <h4 className="text-sm font-medium text-blue-800">Identity Verification</h4>
                              <p className="mt-1 text-xs text-blue-700">
                                {webGLSupported && !useAlternativeVerification
                                  ? "Please allow camera access and position your face within the frame."
                                  : "Please use the alternative verification method below."}
                              </p>
                              {faceDetectionMode === "simple" && (
                                <div className="mt-1 flex items-center text-xs text-blue-600">
                                  <Zap className="mr-1 h-3 w-3" />
                                  <span>Using simplified face detection</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {isModelLoading && (
                          <div className="flex flex-col items-center justify-center py-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading verification system...</p>
                          </div>
                        )}

                        {modelLoadingError && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            <h4 className="font-medium">Verification System Notice:</h4>
                            <p className="mt-1">{modelLoadingError}</p>
                            <div className="mt-2 flex justify-center">
                              {webGLSupported ? (
                                <button
                                  onClick={retryLoadModels}
                                  className="rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200"
                                >
                                  Retry Loading Models
                                </button>
                              ) : (
                                <button
                                  onClick={useAlternativeVerificationMethod}
                                  className="rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200"
                                >
                                  Use Alternative Method
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Show camera verification only if WebGL is supported and alternative method is not selected */}
                        {webGLSupported && !useAlternativeVerification ? (
                          <>
                            <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-black">
                              {isCameraActive ? (
                                <>
                                  <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="h-full w-full object-cover"
                                    style={{ display: isCameraActive ? "block" : "none" }}
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
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                                      <div className="flex flex-col items-center space-y-2 text-white">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                                        <span className="text-sm">
                                          {faceVerificationStage === 1 && "Aligning face..."}
                                          {faceVerificationStage === 2 && `Capturing image ${captureCount}/3...`}
                                          {faceVerificationStage === 3 && "Analyzing..."}
                                        </span>
                                        {verificationProgress > 0 && faceVerificationStage === 3 && (
                                          <div className="w-48">
                                            <div className="mb-1 flex justify-between text-xs">
                                              <span>Analyzing</span>
                                              <span>{verificationProgress}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-700">
                                              <div
                                                className="h-full rounded-full bg-green-500 transition-all duration-300"
                                                style={{ width: `${verificationProgress}%` }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Face detection status indicator */}
                                  <div className="absolute bottom-2 left-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                    <div
                                      className={`mr-1 h-2 w-2 rounded-full ${faceDetected ? "bg-green-500" : "bg-red-500"}`}
                                    ></div>
                                    {faceDetected ? "Face Detected" : "No Face Detected"}
                                  </div>

                                  {/* Face detection quality indicator */}
                                  <div className="absolute bottom-2 right-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                    <span className="mr-1">Quality:</span>
                                    <div className="h-1.5 w-16 rounded-full bg-gray-600">
                                      <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                          faceDetectionQuality > 70
                                            ? "bg-green-500"
                                            : faceDetectionQuality > 40
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                        }`}
                                        style={{ width: `${faceDetectionQuality}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  {/* Camera status indicator */}
                                  {isCameraActive && (
                                    <div className="absolute top-2 right-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                      <div className="mr-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                      Camera Active
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

                            {/* Camera instructions */}
                            {isCameraActive && (
                              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                                <h5 className="font-medium text-gray-700">For best results:</h5>
                                <ul className="mt-1 space-y-1">
                                  <li>• Ensure your face is well-lit</li>
                                  <li>• Remove glasses, masks, or other face coverings</li>
                                  <li>• Look directly at the camera</li>
                                  <li>• Keep a neutral expression</li>
                                </ul>
                              </div>
                            )}

                            {/* Troubleshooting section */}
                            {isCameraActive && (
                              <div className="mt-2">
                                <button
                                  onClick={toggleTroubleshooting}
                                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <div className="flex items-center">
                                    <RefreshCw className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Troubleshooting Options</span>
                                  </div>
                                  <ChevronRight
                                    className={`h-4 w-4 text-gray-500 transition-transform ${showTroubleshooting ? "rotate-90" : ""}`}
                                  />
                                </button>

                                {showTroubleshooting && (
                                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    <p className="mb-2 text-xs text-gray-600">
                                      If you're having trouble with face detection:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        onClick={switchFaceDetectionMode}
                                        className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                      >
                                        Switch to {faceDetectionMode === "advanced" ? "Simple" : "Advanced"} Mode
                                      </button>
                                      <button
                                        onClick={() => {
                                          stopCamera()
                                          setTimeout(() => startCamera(), 500)
                                        }}
                                        className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                      >
                                        Restart Camera
                                      </button>
                                      <button
                                        onClick={useAlternativeVerificationMethod}
                                        className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                      >
                                        Use Alternative Method
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex justify-center space-x-4">
                              {!isCameraActive ? (
                                <>
                                  <Button
                                    onClick={startCamera}
                                    disabled={isLoading || cameraPermission === false || isModelLoading}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                  >
                                    {isModelLoading ? "Loading Models..." : "Start Camera"}
                                  </Button>
                                  <Button
                                    onClick={useAlternativeVerificationMethod}
                                    variant="outline"
                                    className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                  >
                                    Use Alternative Method
                                  </Button>
                                </>
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
                                    disabled={isLoading || !faceDetected}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                  >
                                    Verify Face
                                  </Button>
                                </>
                              )}
                            </div>
                            {/* Force restart camera button */}
                            <Button
                              onClick={() => {
                                stopCamera()
                                setTimeout(() => {
                                  // Force using simple detection mode which is more reliable
                                  setFaceDetectionMode("simple")
                                  setModelsLoaded(true)
                                  startCamera()
                                }, 500)
                              }}
                              variant="secondary"
                              className="mt-2 w-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              Force Restart Camera
                            </Button>
                            {/* For testing - add this near the bottom of the camera section */}
                            {process.env.NODE_ENV === "development" && (
                              <Button
                                onClick={() => {
                                  setFaceVerified(true)
                                  stopCamera()
                                }}
                                variant="outline"
                                className="mt-2 w-full border-dashed border-gray-300 text-gray-500"
                              >
                                [DEV] Skip Face Verification
                              </Button>
                            )}
                          </>
                        ) : (
                          // Alternative verification method (Knowledge-based + OTP)
                          <div className="space-y-4">
                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                              <div className="flex items-start space-x-3">
                                <Lock className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                  <h4 className="text-sm font-medium text-blue-800">Alternative Verification</h4>
                                  <p className="mt-1 text-xs text-blue-700">
                                    {verificationStep === 1
                                      ? "Please answer your security question to verify your identity."
                                      : "Please enter the OTP sent to your registered mobile number."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {verificationStep === 1 && selectedQuestion && (
                              <form onSubmit={verifySecurityAnswer} className="space-y-4">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Security Question</label>
                                  <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                                    {selectedQuestion.question}
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
                                  />
                                  <p className="text-xs text-gray-500">
                                    For demo purposes, the answer is: {selectedQuestion.answer}
                                  </p>
                                </div>

                                {error && (
                                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                                    <AlertCircle className="mr-1 inline-block h-4 w-4" />
                                    {error}
                                  </div>
                                )}

                                <Button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                >
                                  Verify Answer
                                </Button>

                                <div className="text-center text-xs text-gray-500">
                                  <button
                                    type="button"
                                    onClick={loadSecurityQuestions}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    Try a different question
                                  </button>
                                </div>
                              </form>
                            )}

                            {verificationStep === 2 && (
                              <form onSubmit={verifyOTP} className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                      Enter 6-digit OTP
                                    </label>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="mr-1 h-3 w-3" />
                                      <span>Expires in: {formatTime(otpTimer)}</span>
                                    </div>
                                  </div>
                                  <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    maxLength={6}
                                    pattern="\d{6}"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                  />
                                  <p className="text-xs text-gray-500">For demo purposes, the OTP is: {otpCode}</p>
                                </div>

                                {error && (
                                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                                    <AlertCircle className="mr-1 inline-block h-4 w-4" />
                                    {error}
                                  </div>
                                )}

                                <Button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                >
                                  Verify OTP
                                </Button>

                                <div className="text-center text-xs text-gray-500">
                                  <p>
                                    Didn't receive the OTP?{" "}
                                    <button
                                      type="button"
                                      onClick={sendOTP}
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      Resend OTP
                                    </button>
                                  </p>
                                </div>
                              </form>
                            )}
                          </div>
                        )}

                        {/* For testing only - in development mode */}
                        {process.env.NODE_ENV === "development" && (
                          <div className="mt-4 text-center">
                            <button onClick={skipVerification} className="text-xs text-gray-400 hover:text-gray-600">
                              [DEV] Skip verification
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-6">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                          <p className="mt-2 text-center text-sm text-green-700">
                            Your identity has been verified successfully. You can now proceed to the voting page.
                          </p>

                          {/* Verification details */}
                          <div className="mt-4 w-full rounded-lg border border-green-200 bg-white p-3 text-xs">
                            <div className="flex justify-between border-b border-green-100 pb-2">
                              <span className="text-gray-600">Verification ID:</span>
                              <span className="font-medium text-gray-800">
                                {Math.random().toString(36).substring(2, 10).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-green-100 py-2">
                              <span className="text-gray-600">Timestamp:</span>
                              <span className="font-medium text-gray-800">{new Date().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium text-gray-800">
                                {useAlternativeVerification
                                  ? "Knowledge-based + OTP"
                                  : faceDetectionMode === "simple"
                                    ? "Simplified Facial Recognition"
                                    : "Advanced Facial Recognition"}
                              </span>
                            </div>
                          </div>
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
        {debugMode && isCameraActive && (
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
            <h5 className="font-medium text-gray-700">Debug Info:</h5>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>• Camera Active: {isCameraActive ? "Yes" : "No"}</li>
              <li>
                • Video Size: {videoRef.current?.videoWidth || 0}x{videoRef.current?.videoHeight || 0}
              </li>
              <li>
                • Canvas Size: {canvasRef.current?.width || 0}x{canvasRef.current?.height || 0}
              </li>
              <li>• Face Detected: {faceDetected ? "Yes" : "No"}</li>
              <li>• Detection Mode: {faceDetectionMode}</li>
              <li>• Detection Quality: {Math.round(faceDetectionQuality)}%</li>
            </ul>
          </div>
        )}
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

