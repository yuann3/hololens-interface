"use client"

import { useRef, useEffect } from "react"
import { useTranslation } from "./translation-context"
import { motion, AnimatePresence } from "framer-motion"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type * as THREE from "three"

// Sample recognized gestures for the sign language demo
const sampleGestures = ["Hello", "How", "Are", "You", "Today"]

export default function VisualOverlay() {
  const {
    mode,
    status,
    showVisualOverlay,
    recognizedGestures,
    setRecognizedGestures,
    setTranslatedText,
    setStatus,
    uiSize,
  } = useTranslation()

  const groupRef = useRef<THREE.Group>(null)

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  // Simulate gesture recognition
  useEffect(() => {
    if (mode === "visual" && status === "listening") {
      let gestureIndex = 0

      const interval = setInterval(() => {
        if (gestureIndex < sampleGestures.length) {
          setRecognizedGestures((prev) => [...prev, sampleGestures[gestureIndex]])
          gestureIndex++
        } else {
          // When all gestures are recognized, move to translating
          clearInterval(interval)
          setStatus("translating")

          // After a delay, complete the translation
          setTimeout(() => {
            setTranslatedText("How are you today?")
            setStatus("complete")
          }, 2000)
        }
      }, 800)

      return () => clearInterval(interval)
    }
  }, [mode, status, setRecognizedGestures, setTranslatedText, setStatus])

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.03
    }
  })

  if (mode !== "visual" || !showVisualOverlay) return null

  // Apply size scaling to the component
  const sizeStyle = {
    transform: `scale(${uiSize / 100})`,
    transformOrigin: "center center",
  }

  return (
    <group ref={groupRef} position={[0, 0, -2.5]}>
      <Html transform distanceFactor={2} position={[0, 0, 0]} className="no-outline">
        <div className="relative w-[900px] h-[600px]" style={sizeStyle}>
          {/* Simulated hand tracking points */}
          {status === "listening" && (
            <AnimatePresence>
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HandTrackingPoints />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Recognition indicators */}
          {status === "listening" && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <motion.div
                className="px-6 py-3 rounded-xl"
                style={buttonStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white text-xl font-medium">Recognizing sign language...</p>
              </motion.div>
            </div>
          )}

          {/* Gesture recognition bubbles */}
          <AnimatePresence>
            {status === "listening" && (
              <motion.div
                className="absolute top-8 right-8 flex flex-col gap-3 items-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {recognizedGestures.map((gesture, index) => (
                  <motion.div
                    key={`${gesture}-${index}`}
                    className="bg-mode-visual backdrop-blur-md px-5 py-2 rounded-full text-white text-lg font-medium shadow-lg"
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {gesture}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Translating indicator */}
          {status === "translating" && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-6 rounded-xl"
              style={buttonStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 rounded-full bg-mode-visual"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
                <p className="text-white text-2xl font-medium">Translating sign language...</p>
              </div>
            </motion.div>
          )}
        </div>
      </Html>
    </group>
  )
}

// Modernized hand tracking points visualization
function HandTrackingPoints() {
  return (
    <svg width="300" height="300" viewBox="0 0 200 200">
      {/* Palm */}
      <motion.circle
        cx="100"
        cy="120"
        r="12"
        fill="rgba(74, 222, 128, 0.8)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
      />

      {/* Finger joints - thumb */}
      {[
        { x: 70, y: 100 },
        { x: 60, y: 85 },
        { x: 55, y: 70 },
      ].map((pos, i) => (
        <motion.circle
          key={`thumb-${i}`}
          cx={pos.x}
          cy={pos.y}
          r="6"
          fill="rgba(74, 222, 128, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        />
      ))}

      {/* Finger joints - index */}
      {[
        { x: 90, y: 90 },
        { x: 85, y: 70 },
        { x: 80, y: 50 },
      ].map((pos, i) => (
        <motion.circle
          key={`index-${i}`}
          cx={pos.x}
          cy={pos.y}
          r="6"
          fill="rgba(74, 222, 128, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        />
      ))}

      {/* Finger joints - middle */}
      {[
        { x: 105, y: 85 },
        { x: 105, y: 65 },
        { x: 105, y: 45 },
      ].map((pos, i) => (
        <motion.circle
          key={`middle-${i}`}
          cx={pos.x}
          cy={pos.y}
          r="6"
          fill="rgba(74, 222, 128, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Finger joints - ring */}
      {[
        { x: 120, y: 90 },
        { x: 125, y: 70 },
        { x: 130, y: 55 },
      ].map((pos, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={pos.x}
          cy={pos.y}
          r="6"
          fill="rgba(74, 222, 128, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        />
      ))}

      {/* Finger joints - pinky */}
      {[
        { x: 135, y: 100 },
        { x: 145, y: 85 },
        { x: 150, y: 70 },
      ].map((pos, i) => (
        <motion.circle
          key={`pinky-${i}`}
          cx={pos.x}
          cy={pos.y}
          r="6"
          fill="rgba(74, 222, 128, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}

      {/* Connecting lines */}
      <motion.g
        stroke="rgba(74, 222, 128, 0.5)"
        strokeWidth="3"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <path d="M100,120 L70,100 L60,85 L55,70" />
        <path d="M100,120 L90,90 L85,70 L80,50" />
        <path d="M100,120 L105,85 L105,65 L105,45" />
        <path d="M100,120 L120,90 L125,70 L130,55" />
        <path d="M100,120 L135,100 L145,85 L150,70" />
      </motion.g>

      {/* Pulse effect */}
      <motion.circle
        cx="100"
        cy="120"
        r="30"
        stroke="rgba(74, 222, 128, 0.5)"
        strokeWidth="3"
        fill="none"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          repeatType: "loop",
        }}
      />

      {/* Additional glow effect */}
      <motion.circle
        cx="100"
        cy="120"
        r="40"
        stroke="rgba(74, 222, 128, 0.2)"
        strokeWidth="10"
        fill="none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          repeatType: "loop",
          delay: 0.5,
        }}
      />
    </svg>
  )
}

