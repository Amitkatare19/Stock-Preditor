"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, AlertCircle } from "lucide-react"
import { Button } from "./UIComponents"

const FacialVerification = () => {
  const videoRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
              setIsStreaming(true)
              setIsLoading(false)
            })
            .catch((err) => {
              console.error("Error playing video:", err)
              setError("Error playing video. Please try again.")
              setIsLoading(false)
            })
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please make sure you've granted permission.")
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopCamera()
      }
    }
  }, [isStreaming])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <Camera className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Camera Access</h4>
            <p className="mt-1 text-xs text-blue-700">Click the button below to start the camera.</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-black">
        {!isStreaming && !error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Click the button below to start your camera
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mb-2"></div>
            <p>Starting camera...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          style={{ display: isStreaming ? "block" : "none" }}
        />
      </div>

      <div className="flex justify-center">
        {!isStreaming ? (
          <Button
            onClick={startCamera}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Starting Camera..." : "Start Camera"}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            Stop Camera
          </Button>
        )}
      </div>
    </div>
  )
}

export default FacialVerification

