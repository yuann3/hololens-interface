"use client"

import { useRef, useState, useEffect } from "react"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useTranslation } from "./translation-context"
import { Mic, Volume2, Settings, Loader2, Check, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import type * as THREE from "three"
import DraggableWindow from "./draggable-window"

// Sample phrases for audio translation demo
const samplePhrases = [
  "Excuse me, where is the bathroom?",
  "Could I have a glass of water please?",
  "When will we be landing?",
  "I need assistance with my luggage.",
  "Is there a vegetarian meal option?",
]

// Sample translations for the phrases
const sampleTranslations = [
  "¿Disculpe, dónde está el baño?",
  "¿Podría tener un vaso de agua, por favor?",
  "¿Cuándo aterrizaremos?",
  "Necesito ayuda con mi equipaje.",
  "¿Hay una opción de comida vegetariana?",
]

export default function TranslationInterface() {
  const {
    mode,
    status,
    translatedText,
    setTranslatedText,
    showSettings,
    setShowSettings,
    recognizedWords,
    setRecognizedWords,
    audioAmplitude,
    setAudioAmplitude,
    sourceLanguage,
    targetLanguage,
    setStatus,
    setSignGuideReady,
    audioToSignMode,
    setCurrentSignSequence,
    uiSize,
  } = useTranslation()

  const groupRef = useRef<THREE.Group>(null)
  const [opacity, setOpacity] = useState(0)
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [audioVisualization, setAudioVisualization] = useState<number[]>([])
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [showTranslationComplete, setShowTranslationComplete] = useState(false)

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  // Select a random phrase when mode changes to audio
  useEffect(() => {
    if ((mode === "audio" || mode === "audio-to-sign") && status === "listening") {
      const randomIndex = Math.floor(Math.random() * samplePhrases.length)
      setCurrentPhraseIndex(randomIndex)
      setRecognizedWords([])
    }
  }, [mode, status, setRecognizedWords])

  // Generate audio visualization bars
  useEffect(() => {
    if ((mode === "audio" || mode === "audio-to-sign") && status === "listening") {
      const interval = setInterval(() => {
        // Simulate audio input with random amplitudes
        const newAmplitude = Math.random() * 0.8 + 0.2
        setAudioAmplitude(newAmplitude)

        // Create visualization bars
        setAudioVisualization((prev) => {
          const newBars = [...prev, newAmplitude]
          if (newBars.length > 20) newBars.shift()
          return newBars
        })

        // Simulate word recognition
        if (Math.random() > 0.8 && recognizedWords.length < samplePhrases[currentPhraseIndex].split(" ").length) {
          const words = samplePhrases[currentPhraseIndex].split(" ")
          setRecognizedWords(words.slice(0, recognizedWords.length + 1))
        }
      }, 150)

      return () => clearInterval(interval)
    }
  }, [mode, status, recognizedWords, setRecognizedWords, setAudioAmplitude, currentPhraseIndex])

  // Simulate translation process
  useEffect(() => {
    if (status === "listening" && mode === "audio") {
      // After some time, transition to translating
      const listeningTimer = setTimeout(() => {
        // Complete the phrase recognition
        setRecognizedWords(samplePhrases[currentPhraseIndex].split(" "))

        // Move to translating state after listening completes
        setStatus("translating")

        // After a delay, complete the translation
        const translatingTimer = setTimeout(() => {
          setTranslatedText(sampleTranslations[currentPhraseIndex])
          setStatus("complete")
          setShowTranslationComplete(true)
        }, 2000)

        return () => clearTimeout(translatingTimer)
      }, 4000)

      return () => clearTimeout(listeningTimer)
    }
  }, [status, mode, setTranslatedText, setRecognizedWords, currentPhraseIndex, setStatus])

  // Fade in/out effect
  useEffect(() => {
    if (mode !== "idle") {
      setOpacity(1)
    } else {
      setOpacity(0)
      setRecognizedWords([])
      setAudioVisualization([])
      setShowTranslationComplete(false)
    }
  }, [mode, setRecognizedWords])

  // Reset translation complete flag when status changes
  useEffect(() => {
    if (status !== "complete") {
      setShowTranslationComplete(false)

      // Reset sign guide ready state when not complete
      if (mode === "visual" || mode === "audio-to-sign") {
        setSignGuideReady(false)
      }
    }
  }, [status, mode, setSignGuideReady])

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  // Function to retry translation
  const handleRetry = () => {
    setStatus("listening")
    setRecognizedWords([])
    setTranslatedText("")
    setShowTranslationComplete(false)
    setSignGuideReady(false)

    if (mode === "audio-to-sign") {
      setCurrentSignSequence([])
    }

    // Select a new random phrase
    const randomIndex = Math.floor(Math.random() * samplePhrases.length)
    setCurrentPhraseIndex(randomIndex)
  }

  // Don't render in visual mode or audio-to-sign mode (sign language guide will handle it)
  // Only render for audio mode (speech to text)
  if (mode === "idle" || mode === "visual" || mode === "audio-to-sign") return null

  // Apply size scaling to the component
  const sizeStyle = {
    transform: `scale(${uiSize / 100})`,
    transformOrigin: "center center",
  }

  return (
    <group ref={groupRef} position={[0, 0, -1.8]}>
      <Html
        transform
        distanceFactor={1.5}
        position={[0, 0.2, 0]}
        style={{
          transition: "opacity 0.5s ease",
          opacity,
          width: "800px",
        }}
        className="no-outline"
      >
        <div style={sizeStyle}>
          <DraggableWindow title="Speech to Text Translation" onPositionChange={setWindowPosition}>
            <div className="flex flex-col items-center">
              {/* Status indicator */}
              {status !== "idle" && (
                <Badge variant="outline" className="mb-4 blur-badge" style={buttonStyle}>
                  {status === "listening" && (
                    <span className="flex items-center">
                      <Mic className="w-4 h-4 mr-2 text-white/80 animate-pulse" />
                      Listening...
                    </span>
                  )}
                  {status === "translating" && (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 text-white/80 animate-spin" />
                      Translating...
                    </span>
                  )}
                  {status === "complete" && (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-white/80" />
                      Translation Complete
                    </span>
                  )}
                </Badge>
              )}

              {/* Main translation card */}
              <div
                className="blur-panel w-full overflow-hidden rounded-3xl"
                style={{ backgroundColor: "rgba(40, 40, 40, 0.75)" }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full" style={buttonStyle}>
                        <Mic className="w-5 h-5 text-white/80" />
                      </div>
                      <span className="text-xl font-semibold text-white ml-3">Speech to Text Translation</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        style={buttonStyle}
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="h-4 w-4 text-white/80" />
                        <span className="sr-only">Settings</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full" style={buttonStyle}>
                        <X className="h-4 w-4 text-white/80" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </div>

                  {/* Language indicator */}
                  <div className="flex justify-center mb-5">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full" style={buttonStyle}>
                      <span className="text-sm font-medium text-white/90">
                        {sourceLanguage === "auto" ? "English" : sourceLanguage}
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-white/90">
                        {targetLanguage === "es" ? "Spanish" : targetLanguage}
                      </span>
                    </div>
                  </div>

                  {/* Audio visualization (only in audio mode and listening state) */}
                  {status === "listening" && (
                    <div className="mb-6 h-20 flex items-center justify-center">
                      <div className="flex items-end h-full gap-[2px] px-3">
                        {audioVisualization.map((amplitude, i) => (
                          <motion.div
                            key={i}
                            className="w-2 bg-white/60 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${amplitude * 60}px` }}
                            transition={{ duration: 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recognized words animation */}
                  {status === "listening" && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {samplePhrases[currentPhraseIndex].split(" ").map((word, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: recognizedWords.length > index ? 1 : 0.3,
                              y: recognizedWords.length > index ? 0 : 5,
                              color: recognizedWords.length > index ? "rgb(255, 255, 255)" : "rgb(150, 150, 150)",
                            }}
                            className="text-lg font-medium"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Translation content */}
                  <div className="min-h-[150px] flex items-center justify-center">
                    {status === "idle" ? (
                      <p className="text-white/70 text-center text-xl">Ready to translate speech</p>
                    ) : status === "listening" || status === "translating" ? (
                      <div className="flex flex-col items-center justify-center">
                        {status === "translating" && (
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
                            <Loader2 className="h-12 w-12 text-white/80 animate-spin relative z-10" />
                          </div>
                        )}
                        <p className="text-white/70 text-xl">
                          {status === "listening" ? "Listening to speech..." : "Translating..."}
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="wait">
                        {showTranslationComplete && translatedText && (
                          <motion.div
                            key="translation-result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                              delay: 0.2,
                            }}
                            className="w-full text-center"
                          >
                            <p className="text-3xl font-semibold text-white mb-3">{translatedText}</p>
                            <div className="inline-block px-4 py-1.5 rounded-full" style={buttonStyle}>
                              <p className="text-sm text-white/80">Translation from English to Spanish</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center px-3 py-1.5 rounded-full" style={buttonStyle}>
                      <Volume2 className="h-4 w-4 text-white/80 mr-2" />
                      <div className="w-24 h-1.5 bg-blur-light rounded-full overflow-hidden">
                        <div className="h-full bg-white/60 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="default"
                      className="text-base px-5 py-2 gap-2 rounded-full"
                      style={buttonStyle}
                      onClick={handleRetry}
                    >
                      <RefreshCw className="h-4 w-4 text-white/80" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DraggableWindow>
        </div>
      </Html>
    </group>
  )
}

