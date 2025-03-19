"use client"

import { useRef, useState, useEffect } from "react"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useTranslation } from "./translation-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Hand, Check, Mic, RefreshCw } from "lucide-react"
import type * as THREE from "three"
import DraggableWindow from "./draggable-window"
import { motion, AnimatePresence } from "framer-motion"

// Common sign language dictionary
const signDictionary = {
  hello: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Wave your hand with palm facing forward",
  },
  how: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Palms up, fingers spread, move hands outward",
  },
  are: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Point index finger forward, then to yourself",
  },
  you: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Point index finger toward the person you're addressing",
  },
  today: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Touch your dominant index finger to your chin, then move it forward",
  },
  please: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Rub your flat hand in a circular motion on your chest",
  },
  thank: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Touch your fingers to your chin and move your hand forward",
  },
  yes: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Make a fist and nod it up and down, like nodding your head",
  },
  no: {
    image: "/placeholder.svg?height=300&width=300",
    description: "Extend your thumb, index and middle fingers, then close them together",
  },
}

// Sample phrases for audio-to-sign translation
const sampleAudioPhrases = ["Hello how are you today", "Thank you please", "Yes I understand", "No thank you"]

export default function SignLanguageGuide() {
  const {
    signGuideStep,
    setSignGuideStep,
    status,
    setStatus,
    translatedText,
    setTranslatedText,
    mode,
    signGuideVisible,
    setSignGuideVisible,
    signGuideReady,
    setSignGuideReady,
    audioToSignMode,
    currentSignSequence,
    setCurrentSignSequence,
    spokenPhrase,
    setSpokenPhrase,
    recognizedWords,
    setRecognizedWords,
    audioAmplitude,
    setAudioAmplitude,
    uiSize,
  } = useTranslation()

  const groupRef = useRef<THREE.Group>(null)
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const [showHighlight, setShowHighlight] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [audioVisualization, setAudioVisualization] = useState<number[]>([])
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  // Determine the current sign sequence based on mode
  const signSequence = mode === "audio-to-sign" ? currentSignSequence : ["hello", "how", "are", "you", "today"]

  // Ensure the guide is visible when in appropriate modes
  useEffect(() => {
    if (mode === "visual" || mode === "audio-to-sign") {
      if (status === "listening" || status === "translating" || status === "complete") {
        setSignGuideVisible(true)

        // Mark guide as ready when translation is complete
        if (status === "complete") {
          setSignGuideReady(true)
          setShowTranslation(true)

          // If no translation text is set, provide a default
          if (!translatedText && mode === "visual") {
            setTranslatedText("How are you today?")
          }
        }
      }
    } else {
      // Hide guide when not in appropriate modes
      setSignGuideVisible(false)
      setSignGuideReady(false)
      setShowTranslation(false)
    }
  }, [mode, status, translatedText, setTranslatedText, setSignGuideVisible, setSignGuideReady])

  // Handle audio-to-sign mode
  useEffect(() => {
    if (mode === "audio-to-sign" && status === "listening") {
      // Simulate audio input with random amplitudes
      const interval = setInterval(() => {
        const newAmplitude = Math.random() * 0.8 + 0.2
        setAudioAmplitude(newAmplitude)

        // Create visualization bars
        setAudioVisualization((prev) => {
          const newBars = [...prev, newAmplitude]
          if (newBars.length > 20) newBars.shift()
          return newBars
        })

        // Simulate word recognition for the current phrase
        const phrase = sampleAudioPhrases[currentPhraseIndex]
        const words = phrase.split(" ")

        if (Math.random() > 0.8 && recognizedWords.length < words.length) {
          setRecognizedWords(words.slice(0, recognizedWords.length + 1))
        }
      }, 150)

      return () => clearInterval(interval)
    }
  }, [mode, status, currentPhraseIndex, recognizedWords, setRecognizedWords, setAudioAmplitude, setStatus])

  // Process audio to sign translation
  useEffect(() => {
    if (mode === "audio-to-sign") {
      if (status === "listening" && recognizedWords.length > 0) {
        // Convert recognized words to lowercase for dictionary lookup
        const signWords = recognizedWords.map((word) => word.toLowerCase())

        // Filter only words that exist in our sign dictionary
        const validSigns = signWords.filter((word) => signDictionary[word as keyof typeof signDictionary])

        // Update the current sign sequence
        setCurrentSignSequence(validSigns)

        // If all words are recognized, move to translating
        const phrase = sampleAudioPhrases[currentPhraseIndex]
        if (recognizedWords.length >= phrase.split(" ").length) {
          setTimeout(() => {
            setStatus("translating")
            setSpokenPhrase(phrase)

            // After a delay, complete the translation
            setTimeout(() => {
              setStatus("complete")
              setSignGuideReady(true)
            }, 2000)
          }, 1000)
        }
      }
    }
  }, [
    mode,
    status,
    recognizedWords,
    currentPhraseIndex,
    setCurrentSignSequence,
    setStatus,
    setSpokenPhrase,
    setSignGuideReady,
  ])

  // Simulate sign language recognition in visual mode
  useEffect(() => {
    if (mode === "visual" && status === "listening") {
      const interval = setInterval(() => {
        setShowHighlight((prev) => !prev)

        // Simulate recognizing steps over time
        if (Math.random() > 0.7 && completedSteps.length < signSequence.length) {
          const nextStep = completedSteps.length
          if (!completedSteps.includes(nextStep)) {
            setCompletedSteps((prev) => [...prev, nextStep])
            setSignGuideStep(nextStep)
          }
        }
      }, 800)
      return () => clearInterval(interval)
    } else {
      setShowHighlight(false)
    }
  }, [mode, status, completedSteps, signSequence.length, setSignGuideStep])

  // Reset completed steps when mode changes
  useEffect(() => {
    if ((mode !== "visual" && mode !== "audio-to-sign") || status === "idle") {
      setCompletedSteps([])
      setSignGuideStep(0)
      setCurrentSignSequence([])
      setRecognizedWords([])
      setAudioVisualization([])
    }
  }, [mode, status, setSignGuideStep, setCurrentSignSequence, setRecognizedWords])

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5 + 1) * 0.05
    }
  })

  const nextStep = () => {
    if (signGuideStep < signSequence.length - 1) {
      setSignGuideStep(signGuideStep + 1)

      // Mark step as completed when manually advancing
      if (!completedSteps.includes(signGuideStep + 1)) {
        setCompletedSteps((prev) => [...prev, signGuideStep + 1])
      }
    }
  }

  const prevStep = () => {
    if (signGuideStep > 0) {
      setSignGuideStep(signGuideStep - 1)
    }
  }

  // Don't render if the guide shouldn't be visible
  if (!signGuideVisible) return null

  // Get current sign data
  const currentSignKey = signSequence[signGuideStep] || "hello"
  const currentSign = signDictionary[currentSignKey as keyof typeof signDictionary] || {
    image: "/placeholder.svg?height=300&width=300",
    description: "Sign not found",
  }

  // Apply size scaling to the component
  const sizeStyle = {
    transform: `scale(${uiSize / 100})`,
    transformOrigin: "center center",
  }

  // Determine the accent color based on mode
  const accentColor = mode === "visual" ? "green" : "purple"

  return (
    <group ref={groupRef} position={[0, -0.5, -1.8]}>
      <Html transform distanceFactor={1.5} position={[0, 0, 0]} className="no-outline">
        <div style={sizeStyle}>
          <DraggableWindow
            title={mode === "visual" ? "Sign Language Guide" : "Speech to Sign Guide"}
            onPositionChange={setWindowPosition}
            initialPosition={{ x: -window.innerWidth / 3, y: 0 }}
          >
            <div
              className="blur-panel w-[500px] overflow-hidden rounded-3xl"
              style={{ backgroundColor: "rgba(40, 40, 40, 0.75)" }}
            >
              <div className="p-6">
                <div className="text-center mb-5">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {mode === "visual" ? "Sign Language Guide" : "Speech to Sign Guide"}
                  </h3>
                  <div className="inline-block px-4 py-1.5 rounded-full" style={buttonStyle}>
                    <p className="text-base text-white/90">
                      {status === "complete"
                        ? "Translation Complete"
                        : mode === "audio-to-sign"
                          ? "Listening to speech..."
                          : `Step ${signGuideStep + 1} of ${signSequence.length}`}
                    </p>
                  </div>
                </div>

                {/* Audio visualization for audio-to-sign mode */}
                {mode === "audio-to-sign" && status === "listening" && (
                  <div className="mb-5 h-16 flex items-center justify-center">
                    <div className="flex items-end h-full gap-[2px] px-3">
                      {audioVisualization.map((amplitude, i) => (
                        <motion.div
                          key={i}
                          className="w-2 bg-white/60 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${amplitude * 50}px` }}
                          transition={{ duration: 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recognized words for audio-to-sign mode */}
                {mode === "audio-to-sign" && status === "listening" && (
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sampleAudioPhrases[currentPhraseIndex].split(" ").map((word, index) => (
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

                {/* Sign language visualization */}
                <div className="flex justify-center my-5 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`sign-step-${currentSignKey}-${signGuideStep}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="relative rounded-xl overflow-hidden border border-blur-border shadow-lg">
                        <img
                          src={currentSign.image || "/placeholder.svg"}
                          alt={`Sign for ${currentSignKey}`}
                          width={300}
                          height={300}
                          className="rounded-xl"
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                        {/* Hand recognition overlay animation */}
                        {mode === "visual" && status === "listening" && (
                          <motion.div
                            className={`absolute inset-0 rounded-xl ${showHighlight ? "border-2 border-mode-visual" : "border-transparent"}`}
                            animate={{
                              boxShadow: showHighlight
                                ? `0 0 0 3px rgba(${mode === "visual" ? "34, 197, 94" : "168, 85, 247"}, 0.5)`
                                : "none",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {showHighlight && (
                              <div className="absolute top-3 right-3 bg-mode-visual text-white p-2 rounded-full">
                                <Hand className="h-5 w-5" />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Audio to sign indicator */}
                        {mode === "audio-to-sign" && status !== "idle" && (
                          <div className="absolute top-3 right-3 bg-mode-sign text-white p-2 rounded-full">
                            <Mic className="h-5 w-5" />
                          </div>
                        )}

                        {/* Completed step indicator */}
                        {completedSteps.includes(signGuideStep) && status !== "listening" && mode === "visual" && (
                          <div className="absolute top-3 right-3 bg-mode-visual text-white p-2 rounded-full">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {showTranslation && signGuideReady && mode === "visual" ? (
                    <motion.div
                      key="translation-result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-center my-5"
                    >
                      <p className="text-3xl font-semibold text-white mb-3">{translatedText}</p>
                      <div className="inline-block px-4 py-1.5 rounded-full" style={buttonStyle}>
                        <p className="text-sm text-white/80">Sign language translation complete</p>
                      </div>
                    </motion.div>
                  ) : mode === "audio-to-sign" && status === "complete" ? (
                    <motion.div
                      key="audio-to-sign-result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-center my-5"
                    >
                      <p className="text-3xl font-semibold text-white mb-3">"{spokenPhrase}"</p>
                      <div className="inline-block px-4 py-1.5 rounded-full" style={buttonStyle}>
                        <p className="text-sm text-white/80">Use the signs above to communicate</p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <motion.p
                        key={`sign-text-${currentSignKey}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-center text-3xl font-semibold text-white my-3"
                      >
                        {currentSignKey.charAt(0).toUpperCase() + currentSignKey.slice(1)}
                      </motion.p>
                      <motion.div
                        key={`sign-desc-${currentSignKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-center px-4 py-2 rounded-xl mb-4"
                        style={buttonStyle}
                      >
                        <p className="text-base text-white/90">{currentSign.description}</p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Progress indicator */}
                {signSequence.length > 0 && (
                  <div className="flex justify-center gap-2 my-5">
                    {signSequence.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 rounded-full cursor-pointer ${
                          index === signGuideStep
                            ? mode === "visual"
                              ? "bg-mode-visual w-8"
                              : "bg-mode-sign w-8"
                            : completedSteps.includes(index)
                              ? "bg-white/50 w-4"
                              : "bg-white/20 w-4"
                        }`}
                        animate={{
                          backgroundColor:
                            index === signGuideStep
                              ? mode === "visual"
                                ? "rgba(34, 197, 94, 0.7)"
                                : "rgba(168, 85, 247, 0.7)"
                              : completedSteps.includes(index)
                                ? "rgba(255, 255, 255, 0.5)"
                                : "rgba(255, 255, 255, 0.2)",
                          width: index === signGuideStep ? 32 : 16,
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSignGuideStep(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Navigation controls */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={prevStep}
                    disabled={signGuideStep === 0 || status === "complete" || signSequence.length === 0}
                    className="text-base px-4 py-2 gap-2 disabled:opacity-50 rounded-full"
                    style={buttonStyle}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {mode === "audio-to-sign" && (
                    <Button
                      variant="outline"
                      size="default"
                      className="text-base px-4 py-2 gap-2 rounded-full"
                      style={buttonStyle}
                      onClick={() => {
                        // Reset and try a new phrase
                        setRecognizedWords([])
                        setAudioVisualization([])
                        setStatus("listening")
                        setSignGuideReady(false)
                        setCurrentSignSequence([])
                        setSpokenPhrase("")

                        // Select a new random phrase
                        const newIndex = (currentPhraseIndex + 1) % sampleAudioPhrases.length
                        setCurrentPhraseIndex(newIndex)
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      New Phrase
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="default"
                    onClick={nextStep}
                    disabled={
                      signGuideStep === signSequence.length - 1 || status === "complete" || signSequence.length === 0
                    }
                    className="text-base px-4 py-2 gap-2 disabled:opacity-50 rounded-full"
                    style={buttonStyle}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DraggableWindow>
        </div>
      </Html>
    </group>
  )
}

