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
  Shield,
  Smartphone,
  User,
  RefreshCw,
  Zap,
  FileText,
  Key,
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

// Enhanced face detection using canvas API with additional features
const EnhancedFaceDetector = {
  // Detect face using multiple techniques for better reliability
  detectFace: (videoEl, canvasEl) => {
    if (!videoEl || !canvasEl) return { detected: false, quality: 0, landmarks: null }

    try {
      const ctx = canvasEl.getContext("2d")
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height)

      // Get image data from the center of the frame where a face would likely be
      const centerX = canvasEl.width / 2
      const centerY = canvasEl.height / 2
      const sampleSize = Math.min(canvasEl.width, canvasEl.height) * 0.5 // 50% of the smaller dimension

      const imageData = ctx.getImageData(centerX - sampleSize / 2, centerY - sampleSize / 2, sampleSize, sampleSize)

      // Enhanced algorithm to detect skin-like colors
      let skinPixels = 0
      const data = imageData.data

      // Track potential eye regions for liveness detection
      const potentialEyes = []

      for (let y = 0; y < sampleSize; y++) {
        for (let x = 0; x < sampleSize; x++) {
          const idx = (y * sampleSize + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]

          // More sophisticated skin tone detection
          if (r > 60 && g > 40 && b > 20 && r > g && r > b && r - g > 10 && r - b > 10) {
            skinPixels++
          }

          // Simple eye detection (dark regions surrounded by skin)
          if (r < 80 && g < 80 && b < 80) {
            const realX = centerX - sampleSize / 2 + x
            const realY = centerY - sampleSize / 2 + y
            potentialEyes.push({ x: realX, y: realY })
          }
        }
      }

      // Calculate percentage of skin-like pixels
      const totalPixels = sampleSize * sampleSize
      const skinPercentage = (skinPixels / totalPixels) * 100

      // Cluster potential eye regions
      const eyeRegions = []
      if (potentialEyes.length > 0) {
        // Simple clustering algorithm
        const visited = new Set()

        for (let i = 0; i < potentialEyes.length; i++) {
          if (visited.has(i)) continue

          const cluster = [potentialEyes[i]]
          visited.add(i)

          for (let j = 0; j < potentialEyes.length; j++) {
            if (visited.has(j)) continue

            const dist = Math.sqrt(
              Math.pow(potentialEyes[i].x - potentialEyes[j].x, 2) +
                Math.pow(potentialEyes[i].y - potentialEyes[j].y, 2),
            )

            if (dist < 20) {
              // Close enough to be part of the same eye
              cluster.push(potentialEyes[j])
              visited.add(j)
            }
          }

          if (cluster.length > 5) {
            // Minimum size to be considered an eye
            // Calculate center of the cluster
            const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length
            const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length
            eyeRegions.push({ x: centerX, y: centerY, size: cluster.length })
          }
        }
      }

      // Sort eye regions by size (largest first)
      eyeRegions.sort((a, b) => b.size - a.size)

      // Take the two largest regions as eyes
      const eyes = eyeRegions.slice(0, 2)

      // Check if we have two eyes at a reasonable distance
      let hasValidEyes = false
      if (eyes.length === 2) {
        const eyeDist = Math.sqrt(Math.pow(eyes[0].x - eyes[1].x, 2) + Math.pow(eyes[0].y - eyes[1].y, 2))

        // Eyes should be at a reasonable distance apart
        hasValidEyes = eyeDist > 30 && eyeDist < 150
      }

      // Calculate detection quality based on skin percentage and eye detection
      let detectionQuality = skinPercentage * 0.7
      if (hasValidEyes) {
        detectionQuality += 30 // Bonus for detecting eyes
      }

      // Clamp quality between 0 and 100
      detectionQuality = Math.min(100, Math.max(0, detectionQuality))

      // Draw a face detection overlay if quality is good enough
      if (detectionQuality > 30) {
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

        // Draw eye regions if detected
        if (hasValidEyes) {
          eyes.forEach((eye) => {
            ctx.beginPath()
            ctx.arc(eye.x, eye.y, 5, 0, 2 * Math.PI)
            ctx.fillStyle = "#10b981"
            ctx.fill()
          })
        }

        return {
          detected: true,
          quality: detectionQuality,
          landmarks: hasValidEyes ? eyes : null,
        }
      }

      return { detected: false, quality: detectionQuality, landmarks: null }
    } catch (error) {
      console.error("Error in enhanced face detection:", error)
      return { detected: false, quality: 0, landmarks: null }
    }
  },

  // Draw verification overlay with enhanced features
  drawVerificationOverlay: (canvasEl, landmarks = null) => {
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

    // Draw facial landmarks (either from detection or simplified)
    if (landmarks && landmarks.length >= 2) {
      // Draw detected landmarks
      landmarks.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "#10b981"
        ctx.fill()
      })

      // Connect landmarks with lines
      ctx.beginPath()
      ctx.moveTo(landmarks[0].x, landmarks[0].y)
      ctx.lineTo(landmarks[1].x, landmarks[1].y)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 2
      ctx.stroke()
    } else {
      // Draw simplified face landmarks
      const drawLandmark = (x, y) => {
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fillStyle = "#10b981"
        ctx.fill()
      }

      // Eyes
      drawLandmark(centerX - 30, centerY - 20)
      drawLandmark(centerX + 30, centerY - 20)

      // Nose
      drawLandmark(centerX, centerY)

      // Mouth
      drawLandmark(centerX - 20, centerY + 30)
      drawLandmark(centerX, centerY + 35)
      drawLandmark(centerX + 20, centerY + 30)
    }

    // Draw biometric verification animation
    const time = Date.now()
    const numPoints = 8
    const radius = boxSize / 2 + 20

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 + ((time % 3000) / 3000) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + 0.7 * Math.sin(((time % 1000) / 1000) * Math.PI * 2 + i)})`
      ctx.fill()
    }
  },

  // Perform liveness detection (blinking, head movement)
  detectLiveness: (videoEl, canvasEl, previousLandmarks = []) => {
    if (!videoEl || !canvasEl || !previousLandmarks.length) return false

    try {
      // Get current landmarks
      const result = EnhancedFaceDetector.detectFace(videoEl, canvasEl)
      if (!result.detected || !result.landmarks) return false

      const currentLandmarks = result.landmarks

      // Check for movement (simple version)
      let hasMovement = false
      if (previousLandmarks.length >= 2 && currentLandmarks.length >= 2) {
        // Calculate movement of eyes
        const prevLeftEye = previousLandmarks[0]
        const prevRightEye = previousLandmarks[1]
        const currLeftEye = currentLandmarks[0]
        const currRightEye = currentLandmarks[1]

        // Calculate distance moved
        const leftEyeMovement = Math.sqrt(
          Math.pow(prevLeftEye.x - currLeftEye.x, 2) + Math.pow(prevLeftEye.y - currLeftEye.y, 2),
        )

        const rightEyeMovement = Math.sqrt(
          Math.pow(prevRightEye.x - currRightEye.x, 2) + Math.pow(prevRightEye.y - currRightEye.y, 2),
        )

        // If eyes moved more than threshold, consider it movement
        hasMovement = leftEyeMovement > 2 || rightEyeMovement > 2
      }

      return hasMovement
    } catch (error) {
      console.error("Error in liveness detection:", error)
      return false
    }
  },
}

// Biometric verification component
const BiometricVerification = ({ onSuccess, onError }) => {
  const [verificationStep, setVerificationStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Please follow the instructions")

  useEffect(() => {
    // Simulate biometric verification process
    const steps = [
      { message: "Look straight at the camera", duration: 2000 },
      { message: "Blink slowly", duration: 2000 },
      { message: "Turn your head slightly to the right", duration: 2000 },
      { message: "Turn your head slightly to the left", duration: 2000 },
      { message: "Analyzing biometric data...", duration: 3000 },
    ]

    let currentStep = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)
    let elapsedTime = 0

    const interval = setInterval(() => {
      elapsedTime += 100

      // Update progress
      setProgress((elapsedTime / totalDuration) * 100)

      // Check if we need to move to the next step
      let stepTime = 0
      for (let i = 0; i <= currentStep; i++) {
        stepTime += steps[i].duration
      }

      if (elapsedTime >= stepTime && currentStep < steps.length - 1) {
        currentStep++
        setVerificationStep(currentStep + 1)
        setMessage(steps[currentStep].message)
      }

      // Check if verification is complete
      if (elapsedTime >= totalDuration) {
        clearInterval(interval)

        // 90% chance of success (for demo purposes)
        if (Math.random() < 0.9) {
          onSuccess()
        } else {
          onError("Biometric verification failed. Please try again.")
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [onSuccess, onError])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-800">Biometric Verification</h4>
        <p className="mt-1 text-xs text-blue-700">{message}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Step {verificationStep} of 5</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}

// Alternative verification component
const AlternativeVerification = ({ onSuccess, onError }) => {
  const [step, setStep] = useState(1)
  const [idNumber, setIdNumber] = useState("")
  const [dob, setDob] = useState("")
  const [address, setAddress] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(120)
  const [otpTimerActive, setOtpTimerActive] = useState(false)
  const timerRef = useRef(null)

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // OTP timer effect
  useEffect(() => {
    if (otpTimerActive && otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0) {
      setOtpSent(false)
      onError("OTP has expired. Please request a new one.")
      setOtpTimerActive(false)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [otpTimerActive, otpTimer, onError])

  // Verify personal information
  const verifyPersonalInfo = (e) => {
    e.preventDefault()
    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)

      // For demo purposes, accept any input with proper format
      if (idNumber && dob && address) {
        setStep(2)
        sendOtps()
      } else {
        onError("Please fill in all required fields.")
      }
    }, 1500)
  }

  // Send OTPs to phone and email
  const sendOtps = () => {
    // Generate 6-digit OTPs
    const phoneOtpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const emailOtpCode = Math.floor(100000 + Math.random() * 900000).toString()

    setPhoneOtp(phoneOtpCode)
    setEmailOtp(emailOtpCode)
    setOtpSent(true)
    setOtpTimer(120)
    setOtpTimerActive(true)

    // In a real app, these would be sent to the user's phone and email
    console.log(`Phone OTP: ${phoneOtpCode}`)
    console.log(`Email OTP: ${emailOtpCode}`)
  }

  // Verify OTPs
  const verifyOtps = (e) => {
    e.preventDefault()
    setIsVerifying(true)

    const enteredPhoneOtp = e.target.elements.phoneOtp.value
    const enteredEmailOtp = e.target.elements.emailOtp.value

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)

      if (enteredPhoneOtp === phoneOtp && enteredEmailOtp === emailOtp) {
        setOtpTimerActive(false)
        onSuccess()
      } else {
        onError("Incorrect OTP(s). Please check and try again.")
      }
    }, 1500)
  }

  // Resend OTPs
  const resendOtps = () => {
    sendOtps()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Alternative Verification</h4>
            <p className="mt-1 text-xs text-blue-700">
              {step === 1
                ? "Please verify your identity using your personal information."
                : "Enter the OTPs sent to your registered phone and email."}
            </p>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={verifyPersonalInfo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Voter ID / Aadhaar Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your ID number"
              required
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registered Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your registered address"
              rows={2}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isVerifying ? "Verifying..." : "Verify Information"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyOtps} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="phoneOtp" className="block text-sm font-medium text-gray-700">
                Phone OTP
              </label>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="mr-1 h-3 w-3" />
                <span>Expires in: {formatTime(otpTimer)}</span>
              </div>
            </div>
            <input
              type="text"
              id="phoneOtp"
              name="phoneOtp"
              maxLength={6}
              pattern="\\d{6}"
              placeholder="Enter 6-digit OTP sent to your phone"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500">For demo purposes, the phone OTP is: {phoneOtp}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700">
              Email OTP
            </label>
            <input
              type="text"
              id="emailOtp"
              name="emailOtp"
              maxLength={6}
              pattern="\\d{6}"
              placeholder="Enter 6-digit OTP sent to your email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500">For demo purposes, the email OTP is: {emailOtp}</p>
          </div>

          <Button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isVerifying ? "Verifying..." : "Verify OTPs"}
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>
              Didn't receive the OTPs?{" "}
              <button type="button" onClick={resendOtps} className="text-blue-600 hover:text-blue-800 hover:underline">
                Resend OTPs
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

// Document verification component
const DocumentVerification = ({ onSuccess, onError }) => {
  const [documentType, setDocumentType] = useState("aadhaar")
  const [documentNumber, setDocumentNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)

      // For demo purposes, accept any input with proper format
      if (documentType === "aadhaar" && /^\d{12}$/.test(documentNumber.replace(/\s/g, ""))) {
        onSuccess()
      } else if (documentType === "pan" && /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(documentNumber)) {
        onSuccess()
      } else if (documentType === "voter" && /^[A-Z]{3}\d{7}$/.test(documentNumber)) {
        onSuccess()
      } else {
        onError("Invalid document number. Please check and try again.")
      }
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <FileText className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Document Verification</h4>
            <p className="mt-1 text-xs text-blue-700">Please provide your document details for verification</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="aadhaar">Aadhaar Card</option>
            <option value="pan">PAN Card</option>
            <option value="voter">Voter ID</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Document Number</label>
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder={
              documentType === "aadhaar" ? "1234 5678 9012" : documentType === "pan" ? "ABCDE1234F" : "ABC1234567"
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {documentType === "aadhaar"
              ? "Enter your 12-digit Aadhaar number"
              : documentType === "pan"
                ? "Enter your 10-character PAN number"
                : "Enter your Voter ID number"}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          {isVerifying ? "Verifying..." : "Verify Document"}
        </Button>
      </div>
    </form>
  )
}

// Digital signature component
const DigitalSignature = ({ onSuccess, onError }) => {
  const [signature, setSignature] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!signature) {
      onError("Please draw your signature")
      return
    }

    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      onSuccess()
    }, 2000)
  }

  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.lineWidth = 2
    ctx.strokeStyle = "#1e40af"

    const startDrawing = (e) => {
      setIsDrawing(true)
      ctx.beginPath()
      const rect = canvas.getBoundingClientRect()
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }

    const draw = (e) => {
      if (!isDrawing) return

      const rect = canvas.getBoundingClientRect()
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
      ctx.stroke()
    }

    const stopDrawing = () => {
      if (isDrawing) {
        setIsDrawing(false)
        setSignature(canvas.toDataURL())
      }
    }

    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseout", stopDrawing)

    // Touch events
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      })
      canvas.dispatchEvent(mouseEvent)
    })

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      })
      canvas.dispatchEvent(mouseEvent)
    })

    canvas.addEventListener("touchend", (e) => {
      e.preventDefault()
      const mouseEvent = new MouseEvent("mouseup", {})
      canvas.dispatchEvent(mouseEvent)
    })

    return () => {
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseout", stopDrawing)

      canvas.removeEventListener("touchstart", startDrawing)
      canvas.removeEventListener("touchmove", draw)
      canvas.removeEventListener("touchend", stopDrawing)
    }
  }, [isDrawing])

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignature("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <Key className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Digital Signature</h4>
            <p className="mt-1 text-xs text-blue-700">Please draw your signature below to verify your identity</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-300 bg-white p-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full cursor-crosshair rounded border border-gray-200 bg-gray-50"
          />
          <div className="mt-2 flex justify-between">
            <p className="text-xs text-gray-500">Draw your signature above</p>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isVerifying || !signature}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          {isVerifying ? "Verifying..." : "Submit Signature"}
        </Button>
      </div>
    </form>
  )
}

export default function VoteVerificationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Mobile verification, 2: Identity verification
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
  const [faceDetected, setFaceDetected] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [sessionTimer, setSessionTimer] = useState(600) // 10 minutes in seconds
  const [sessionTimerActive, setSessionTimerActive] = useState(false)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const [faceDetectionMode, setFaceDetectionMode] = useState("enhanced") // 'enhanced' or 'advanced'
  const [faceDetectionQuality, setFaceDetectionQuality] = useState(0) // 0-100
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)
  const [captureCount, setCaptureCount] = useState(0)
  const [faceVerificationStage, setFaceVerificationStage] = useState(0) // 0: not started, 1: aligning, 2: capturing, 3: analyzing
  const [livenessDetected, setLivenessDetected] = useState(false)
  const [previousLandmarks, setPreviousLandmarks] = useState([])
  const [livenessChecks, setLivenessChecks] = useState(0)
  const [verificationMethod, setVerificationMethod] = useState("facial") // 'facial', 'document', 'biometric', 'signature'
  const [secondaryVerificationComplete, setSecondaryVerificationComplete] = useState(false)
  const [showAlternativeMethod, setShowAlternativeMethod] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const animationRef = useRef(null)
  const livenessIntervalRef = useRef(null)

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

  // Session timer effect
  useEffect(() => {
    if (sessionTimerActive && sessionTimer > 0) {
      timerRef.current = setTimeout(() => {
        setSessionTimer((prev) => prev - 1)
      }, 1000)
    } else if (sessionTimer === 0) {
      // Session expired
      setError("Your session has expired for security reasons. Please refresh the page and try again.")
      stopCamera()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sessionTimerActive, sessionTimer])

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

      // Start with enhanced face detection by default - more reliable
      setFaceDetectionMode("enhanced")
      setModelsLoaded(true)

      // Start session timer
      setSessionTimerActive(true)

      // Only try to load face-api models if WebGL is supported
      if (checkWebGLSupport()) {
        loadFaceApiModels()
      } else {
        console.log("WebGL not supported, using enhanced face detection")
        setFaceDetectionMode("enhanced")
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
        if (livenessIntervalRef.current) {
          clearInterval(livenessIntervalRef.current)
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
          // Software renderers often have issues with face-api.js, so we'll use enhanced detection
          setFaceDetectionMode("enhanced")
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
      console.log("WebGL is not supported, switching to enhanced detection")
      setModelLoadingError("WebGL is not supported on this device. Using enhanced detection method.")
      setIsModelLoading(false)
      setFaceDetectionMode("enhanced")
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
        console.log("Some model files are missing, falling back to enhanced detection")
        setFaceDetectionMode("enhanced")
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
        console.log("Falling back to enhanced detection")
        setFaceDetectionMode("enhanced")
        setModelsLoaded(true)
      }
    } catch (error) {
      console.error("Error in loadFaceApiModels:", error)
      setModelLoadingError(error.message || "Failed to load facial recognition models")
      setError("Failed to load facial recognition models. Using enhanced detection.")
      // Fall back to enhanced detection
      setFaceDetectionMode("enhanced")
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

            // Start liveness detection
            startLivenessDetection()
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
                startLivenessDetection()
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
        if (faceDetectionMode === "enhanced") {
          // Use enhanced face detection
          const result = EnhancedFaceDetector.detectFace(videoRef.current, canvasRef.current)
          setFaceDetected(result.detected)
          setFaceDetectionQuality(result.quality)

          // Store landmarks for liveness detection
          if (result.landmarks) {
            setPreviousLandmarks(result.landmarks)
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

  // Start liveness detection
  const startLivenessDetection = () => {
    if (livenessIntervalRef.current) {
      clearInterval(livenessIntervalRef.current)
    }

    // Check for liveness every 500ms
    livenessIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && isCameraActive && previousLandmarks.length > 0) {
        const isLive = EnhancedFaceDetector.detectLiveness(videoRef.current, canvasRef.current, previousLandmarks)

        if (isLive) {
          setLivenessChecks((prev) => prev + 1)

          // After 5 successful liveness checks, consider it verified
          if (livenessChecks >= 5 && !livenessDetected) {
            setLivenessDetected(true)
            console.log("Liveness detected!")

            // Clear the interval once liveness is detected
            clearInterval(livenessIntervalRef.current)
          }
        }
      }
    }, 500)
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

        // Store eye landmarks for liveness detection
        setPreviousLandmarks([
          { x: leftEye[0]._x, y: leftEye[0]._y },
          { x: rightEye[0]._x, y: rightEye[0]._y },
        ])
      } else {
        setFaceDetected(false)
        setFaceDetectionQuality((prev) => Math.max(0, prev - 5))
      }
    } catch (error) {
      console.error("Error during face detection:", error)
      // If face-api.js fails, try to fall back to enhanced detection
      if (faceDetectionMode === "advanced") {
        console.log("Falling back to enhanced face detection")
        setFaceDetectionMode("enhanced")
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

    if (livenessIntervalRef.current) {
      clearInterval(livenessIntervalRef.current)
      livenessIntervalRef.current = null
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

    if (!livenessDetected) {
      setError("Liveness check failed. Please move your head slightly to verify you're a real person.")
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
            if (faceDetectionMode === "enhanced") {
              EnhancedFaceDetector.drawVerificationOverlay(canvasRef.current, previousLandmarks)
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

                // After facial verification, require secondary verification
                setVerificationMethod("document") // Start with document verification
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
      // Fall back to enhanced verification
      EnhancedFaceDetector.drawVerificationOverlay(canvasRef.current, previousLandmarks)
    }
  }

  // Handle secondary verification success
  const handleSecondaryVerificationSuccess = () => {
    setSecondaryVerificationComplete(true)
    setFaceVerified(true)
  }

  // Handle secondary verification error
  const handleSecondaryVerificationError = (errorMessage) => {
    setError(errorMessage)
  }

  // Proceed to voting page
  const proceedToVoting = () => {
    // Set a flag in session storage to indicate the user has been verified
    sessionStorage.setItem("voteVerified", "true")
    navigate("/voting/cast-vote")
  }

  // Switch to alternative verification method
  const switchToAlternativeMethod = () => {
    stopCamera()
    setShowAlternativeMethod(true)
    setError(null)
  }

  // Switch face detection mode
  const switchFaceDetectionMode = () => {
    const newMode = faceDetectionMode === "advanced" ? "enhanced" : "advanced"
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

        {/* Session timer */}
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          <span>Session expires in: {formatTime(sessionTimer)}</span>
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
                  </div>
                )}

                {/* Step 2: Facial Recognition */}
                {step === 2 && (
                  <div className="space-y-4">
                    {!faceVerified ? (
                      <>
                        {!secondaryVerificationComplete ? (
                          <>
                            {showAlternativeMethod ? (
                              <AlternativeVerification
                                onSuccess={handleSecondaryVerificationSuccess}
                                onError={handleSecondaryVerificationError}
                              />
                            ) : (
                              verificationMethod === "facial" && (
                                <>
                                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                    <div className="flex items-start space-x-3">
                                      <Camera className="mt-0.5 h-5 w-5 text-blue-600" />
                                      <div>
                                        <h4 className="text-sm font-medium text-blue-800">Facial Recognition</h4>
                                        <p className="mt-1 text-xs text-blue-700">
                                          Please allow camera access and position your face within the frame.
                                        </p>
                                        {faceDetectionMode === "enhanced" && (
                                          <div className="mt-1 flex items-center text-xs text-blue-600">
                                            <Zap className="mr-1 h-3 w-3" />
                                            <span>Using enhanced face detection</span>
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

                                        {/* Liveness detection indicator */}
                                        <div className="absolute top-2 right-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                          <div
                                            className={`mr-1 h-2 w-2 rounded-full ${livenessDetected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}
                                          ></div>
                                          {livenessDetected ? "Liveness Verified" : "Checking Liveness..."}
                                        </div>
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
                                        <li>• Move your head slightly to verify liveness</li>
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
                                              Switch to {faceDetectionMode === "advanced" ? "Enhanced" : "Advanced"}{" "}
                                              Mode
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
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex justify-center space-x-4">
                                    {!isCameraActive ? (
                                      <Button
                                        onClick={startCamera}
                                        disabled={isLoading || cameraPermission === false || isModelLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
                                          disabled={isLoading || !faceDetected || !livenessDetected}
                                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                        >
                                          Verify Face
                                        </Button>
                                      </>
                                    )}
                                  </div>

                                  <div className="mt-4 text-center">
                                    <p className="mb-2 text-sm text-gray-600">
                                      Having trouble with facial recognition?
                                    </p>
                                    <Button
                                      onClick={switchToAlternativeMethod}
                                      variant="outline"
                                      className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    >
                                      Use Alternative Verification Method
                                    </Button>
                                  </div>
                                </>
                              )
                            )}

                            {verificationMethod === "document" && (
                              <DocumentVerification
                                onSuccess={() => {
                                  setVerificationMethod("biometric")
                                }}
                                onError={handleSecondaryVerificationError}
                              />
                            )}

                            {verificationMethod === "biometric" && (
                              <BiometricVerification
                                onSuccess={() => {
                                  setVerificationMethod("signature")
                                }}
                                onError={handleSecondaryVerificationError}
                              />
                            )}

                            {verificationMethod === "signature" && (
                              <DigitalSignature
                                onSuccess={handleSecondaryVerificationSuccess}
                                onError={handleSecondaryVerificationError}
                              />
                            )}

                            {error && (
                              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
                                <AlertCircle className="mr-1 inline-block h-4 w-4" />
                                {error}
                              </div>
                            )}
                          </>
                        ) : null}
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
                              <span className="text-gray-600">Methods:</span>
                              <span className="font-medium text-gray-800">Facial + Document + Biometric</span>
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

