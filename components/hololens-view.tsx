"use client"

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import { useTranslation } from "./translation-context"
import TranslationInterface from "./translation-interface"
import SignLanguageGuide from "./sign-language-guide"
import VisualOverlay from "./visual-overlay"

export default function HoloLensView() {
  const { mode, status, showSignGuide, showVisualOverlay, setShowVisualOverlay } = useTranslation()
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])

  // Simulate head movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (mode !== "idle") {
        setCameraPosition([Math.sin(Date.now() * 0.0005) * 0.1, Math.cos(Date.now() * 0.0003) * 0.05, 5])
      }
    }, 50)
    return () => clearInterval(interval)
  }, [mode])

  // Show visual overlay in visual mode
  useEffect(() => {
    if (mode === "visual" && status === "listening") {
      setShowVisualOverlay(true)
    } else {
      setShowVisualOverlay(false)
    }
  }, [mode, status, setShowVisualOverlay])

  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Environment preset="night" background={false} />

        <Suspense fallback={null}>
          <TranslationInterface />
          {showSignGuide && <SignLanguageGuide />}
          <VisualOverlay />
        </Suspense>
      </Canvas>

      {/* Enhanced overlay for curved screen effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(0,0,0,0.6)_100%)]"></div>

        {/* Lens curvature effect */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0.15) 100%)",
            borderRadius: "50%/10%",
            pointerEvents: "none",
          }}
        ></div>

        {/* Subtle blue tint for HoloLens effect */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
          }}
        ></div>

        {/* Light flares */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
              top: "10%",
              left: "20%",
              animation: "breathe 8s infinite ease-in-out",
            }}
          ></div>
          <div
            className="absolute w-[200px] h-[200px] rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)",
              bottom: "15%",
              right: "25%",
              animation: "breathe 6s infinite ease-in-out 2s",
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

