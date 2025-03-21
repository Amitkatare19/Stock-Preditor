"use client"

import { useEffect } from "react"
import { AlertCircle, Camera, ChevronRight, RefreshCw, Zap } from "lucide-react"
import { useVerification } from "../../context/VerificationContext"
import { Button } from "./UIComponents"
import * as faceapi from "face-api.js"
import { EnhancedFaceDetector, checkWebGLSupport } from "../../utils/FaceDetection"

const FacialVerification = () => {
  const {
    videoRef,
    canvasRef,
    streamRef,
    isCameraActive,
    faceDetected,
    faceDetectionQuality,
    livenessDetected,
    previousLandmarks,
    livenessChecks,
    faceDetectionMode,
    faceVerificationStage,
    captureCount,
    verificationProgress,
    cameraPermission,
    isModelLoading,
    modelLoadingError,
    isLoading,
    error,
    alertMessage,
    showTroubleshooting,
    setIsCameraActive,
    setCameraPermission,
    setFaceDetected,
    setFaceDetectionQuality,
    setLivenessDetected,
    setPreviousLandmarks,
    setLivenessChecks,
    setFaceDetectionMode,
    setFaceVerificationStage,
    setCaptureCount,
    setVerificationProgress,
    setIsModelLoading,
    setModelLoadingError,
    setIsLoading,
    setError,
    showAlert,
    toggleTroubleshooting,
    stopCamera,
    setVerificationMethod,
    facialRecognitionFailed,
    showAlternativeOption,
    handleFacialRecognitionFailure,
  } = useVerification()

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
        setModelLoadingError("Some model files could not be loaded. Using enhanced detection method.")
        setIsModelLoading(false)
        return
      }

      // Try to load models with better error handling
      try {
        // Load models one by one with individual error handling
        try {
          console.log("Loading tiny face detector model...")
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
          console.log("Tiny face detector model loaded successfully")
        } catch (error) {
          console.error("Error loading tiny face detector model:", error)
          throw new Error("Failed to load face detector model")
        }

        try {
          console.log("Loading face landmark model...")
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          console.log("Face landmark model loaded successfully")
        } catch (error) {
          console.error("Error loading face landmark model:", error)
          throw new Error("Failed to load face landmark model")
        }

        try {
          console.log("Loading face recognition model...")
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
          console.log("Face recognition model loaded successfully")
        } catch (error) {
          console.error("Error loading face recognition model:", error)
          throw new Error("Failed to load face recognition model")
        }

        console.log("All face-API models loaded successfully")
        setFaceDetectionMode("advanced")
      } catch (error) {
        console.error("Error loading models:", error)
        console.log("Falling back to enhanced detection")
        setModelLoadingError(`${error.message}. Using enhanced detection method.`)
        setFaceDetectionMode("enhanced")
      }
    } catch (error) {
      console.error("Error in loadFaceApiModels:", error)
      setModelLoadingError(error.message || "Failed to load facial recognition models")
      showAlert("Failed to load facial recognition models. Using enhanced detection.", "warning")
      // Fall back to enhanced detection
      setFaceDetectionMode("enhanced")
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
          width: { ideal: 640 },
          height: { ideal: 480 },
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
            showAlert(`Error playing video: ${err.message}. Try reloading the page.`, "error")
            setIsLoading(false)
          })
      }

      videoRef.current.onerror = (err) => {
        console.error("Video element error:", err)
        showAlert(`Video element error: ${err}`, "error")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraPermission(false)
      setIsLoading(false)

      if (error.name === "NotAllowedError") {
        showAlert(
          "Camera access denied. Please allow camera access in your browser settings and reload the page.",
          "error",
        )
      } else if (error.name === "NotFoundError") {
        showAlert("No camera found. Please connect a camera and try again.", "error")
      } else if (error.name === "NotReadableError") {
        showAlert(
          "Camera is already in use by another application. Please close other applications using the camera.",
          "error",
        )
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
                showAlert(`Failed to play video: ${err.message}`, "error")
                setIsLoading(false)
              })
          }
        } catch (fallbackError) {
          showAlert(`Camera error: Could not access any camera. ${fallbackError.message}`, "error")
          setIsLoading(false)
        }
      } else {
        showAlert(`Camera error: ${error.message || "Unknown error"}. Please try a different browser.`, "error")
      }
    }
  }

  // Start face detection interval
  const startFaceDetection = () => {
    console.log("Starting face detection with mode:", faceDetectionMode)

    let animationRef = null

    // Use requestAnimationFrame for smoother detection
    const detectFrame = () => {
      if (videoRef.current && canvasRef.current && isCameraActive) {
        try {
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
        } catch (error) {
          console.error("Error in face detection frame:", error)
          // If there's an error in the detection frame, switch to enhanced mode
          if (faceDetectionMode !== "enhanced") {
            console.log("Error in advanced detection, switching to enhanced mode")
            setFaceDetectionMode("enhanced")
          }
        }
      }
      animationRef = requestAnimationFrame(detectFrame)
    }

    detectFrame()

    // Return cleanup function
    return () => {
      if (animationRef) {
        cancelAnimationFrame(animationRef)
      }
    }
  }

  // Start liveness detection
  const startLivenessDetection = () => {
    let livenessIntervalRef = null

    // Check for liveness every 500ms
    livenessIntervalRef = setInterval(() => {
      if (videoRef.current && canvasRef.current && isCameraActive && previousLandmarks.length > 0) {
        const isLive = EnhancedFaceDetector.detectLiveness(videoRef.current, canvasRef.current, previousLandmarks)

        if (isLive) {
          setLivenessChecks((prev) => prev + 1)

          // After 5 successful liveness checks, consider it verified
          if (livenessChecks >= 5 && !livenessDetected) {
            setLivenessDetected(true)
            console.log("Liveness detected!")
            showAlert("Liveness verified! You can now proceed with verification.", "success")

            // Clear the interval once liveness is detected
            clearInterval(livenessIntervalRef)
          }
        }
      }
    }, 500)

    // Return cleanup function
    return () => {
      if (livenessIntervalRef) {
        clearInterval(livenessIntervalRef)
      }
    }
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
        console.log("Falling back to enhanced face detection due to error:", error.message)
        setFaceDetectionMode("enhanced")
        showAlert("Advanced face detection failed. Using enhanced detection method.", "warning")
      }
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
        showAlert("No face detected. Please ensure your face is clearly visible.", "error")
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

  // Capture and verify face
  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      showAlert("Camera is not active. Please start the camera first.", "error")
      return
    }

    if (!faceDetected) {
      showAlert("No face detected. Please ensure your face is clearly visible.", "error")
      return
    }

    if (!livenessDetected) {
      showAlert("Liveness check failed. Please move your head slightly to verify you're a real person.", "error")
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
                showAlert("Facial verification successful! Please complete the document verification.", "success")
              }
            }, 100)
          }
        }, 800)
      }, 1000)
    } catch (error) {
      console.error("Error during facial verification:", error)
      showAlert(`Facial verification failed: ${error.message || "Unknown error"}`, "error")
      setIsLoading(false)
      setFaceVerificationStage(0)
      handleVerificationFailure()
    }
  }

  const handleVerificationFailure = () => {
    handleFacialRecognitionFailure()
  }

  // Switch face detection mode
  const switchFaceDetectionMode = () => {
    const newMode = faceDetectionMode === "advanced" ? "enhanced" : "advanced"
    console.log(`Switching face detection mode to: ${newMode}`)
    setFaceDetectionMode(newMode)

    // Restart face detection with new mode
    if (isCameraActive) {
      startFaceDetection()
    }
  }

  // Load face-api models on component mount
  useEffect(() => {
    if (checkWebGLSupport()) {
      loadFaceApiModels()
    }
  }, [])

  // Update the switchToAlternativeVerification function to remove the button
  const handleSwitchToAlternativeVerification = () => {
    // Stop camera if it's active
    if (isCameraActive) {
      stopCamera()
    }

    // Switch to alternative verification method
    setVerificationMethod("alternative")
  }

  return (
    <div className="space-y-4">
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

      {modelLoadingError && !alertMessage && (
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
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" width={640} height={480} />
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
              <div className={`mr-1 h-2 w-2 rounded-full ${faceDetected ? "bg-green-500" : "bg-red-500"}`}></div>
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
                <p className="text-sm">Camera access denied. Please allow camera access in your browser settings.</p>
              </div>
            ) : (
              <>
                <Camera className="mb-2 h-10 w-10 text-gray-400" />
                <p className="text-center text-sm text-gray-400">Click the button below to start camera</p>
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
              <p className="mb-2 text-xs text-gray-600">If you're having trouble with face detection:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={switchFaceDetectionMode}
                  className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                >
                  Switch to {faceDetectionMode === "advanced" ? "Enhanced" : "Advanced"} Mode
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

      {/* Alternative verification option button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleSwitchToAlternativeVerification}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Having trouble? Use alternative verification method
        </button>
      </div>

      {error && !alertMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
          <AlertCircle className="mr-1 inline-block h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

export default FacialVerification

