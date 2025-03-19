"use client"

import { useBackground } from "./background-context"
import { Button } from "./ui/button"
import { Camera, Home } from "lucide-react"

export default function CameraToggleButton() {
  const { backgroundType, toggleBackground } = useBackground()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleBackground}
      className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border-white/20 hover:bg-black/70 transition-all"
      title={`Switch to ${backgroundType === "cabin" ? "camera" : "cabin"} background`}
    >
      {backgroundType === "cabin" ? (
        <Camera className="h-6 w-6 text-white" />
      ) : (
        <Home className="h-6 w-6 text-white" />
      )}
    </Button>
  )
} 