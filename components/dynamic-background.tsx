"use client"

import { useBackground } from "./background-context"
import CabinBackground from "./cabin-background"
import CameraBackground from "./camera-background"
import { useEffect, useState } from "react"

export default function DynamicBackground() {
  const { backgroundType } = useBackground()
  const [showCabin, setShowCabin] = useState(true)
  const [showCamera, setShowCamera] = useState(false)

  // Handle background transitions with delay to prevent overlap
  useEffect(() => {
    if (backgroundType === "camera") {
      setShowCamera(true)
      // Hide cabin after a small delay to allow camera to initialize
      const timer = setTimeout(() => setShowCabin(false), 100)
      return () => clearTimeout(timer)
    } else {
      setShowCabin(true)
      // Hide camera after cabin is visible
      const timer = setTimeout(() => setShowCamera(false), 500)
      return () => clearTimeout(timer)
    }
  }, [backgroundType])

  return (
    <>
      {showCabin && <CabinBackground />}
      {showCamera && <CameraBackground />}
    </>
  )
} 