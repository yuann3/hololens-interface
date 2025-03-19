"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "./translation-context"
import { Button } from "@/components/ui/button"
import {
  Mic,
  Hand,
  Loader2,
  Settings,
  VolumeX,
  Volume,
  Volume1,
  Volume2,
  MessageSquare,
  Maximize,
  Minimize,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  X,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import DraggableWindow from "./draggable-window"
import CabinBackground from "./cabin-background"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

export default function InterfaceControls() {
  const {
    mode,
    setMode,
    status,
    setStatus,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    volume,
    setVolume,
    brightness,
    setBrightness,
    showSettings,
    setShowSettings,
    setShowSignGuide,
    setRecognizedWords,
    setTranslatedText,
    setSignGuideVisible,
    setSignGuideReady,
    setAudioToSignMode,
    setCurrentSignSequence,
    setSpokenPhrase,
    setRecognizedGestures,
    uiSize,
    setUiSize,
  } = useTranslation()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [settingsPosition, setSettingsPosition] = useState({ x: 0, y: 0 })

  // Handle audio translation
  const handleAudioTranslate = () => {
    if (mode === "audio") {
      setMode("idle")
      setStatus("idle")
      setRecognizedWords([])
      setTranslatedText("")
      return
    }

    // Reset sign language guide when switching to audio mode
    setSignGuideVisible(false)
    setSignGuideReady(false)
    setShowSignGuide(false)
    setAudioToSignMode(false)

    setMode("audio")
    setStatus("listening")
    setIsProcessing(true)
    setRecognizedWords([])
    setTranslatedText("")
  }

  // Handle visual translation (sign language to text)
  const handleVisualTranslate = () => {
    if (mode === "visual") {
      setMode("idle")
      setStatus("idle")
      setSignGuideVisible(false)
      setSignGuideReady(false)
      setShowSignGuide(false)
      setTranslatedText("")
      setRecognizedGestures([])
      return
    }

    setMode("visual")
    setStatus("listening")
    setIsProcessing(true)
    setTranslatedText("")
    setAudioToSignMode(false)

    // Activate sign language guide
    setSignGuideVisible(true)
    setShowSignGuide(true)
    setRecognizedGestures([])
  }

  // Handle audio to sign language translation
  const handleAudioToSignTranslate = () => {
    if (mode === "audio-to-sign") {
      setMode("idle")
      setStatus("idle")
      setSignGuideVisible(false)
      setSignGuideReady(false)
      setShowSignGuide(false)
      setTranslatedText("")
      setAudioToSignMode(false)
      setCurrentSignSequence([])
      setSpokenPhrase("")
      return
    }

    setMode("audio-to-sign")
    setStatus("listening")
    setIsProcessing(true)
    setTranslatedText("")
    setRecognizedWords([])

    // Activate audio to sign mode
    setAudioToSignMode(true)
    setSignGuideVisible(true)
    setShowSignGuide(true)
    setCurrentSignSequence([])
    setSpokenPhrase("")
  }

  // Update isProcessing state based on status
  useEffect(() => {
    if (status === "complete") {
      setIsProcessing(false)
    } else if (status === "listening" || status === "translating") {
      setIsProcessing(true)
    }
  }, [status])

  // Volume icon based on level
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 33) return <Volume className="h-5 w-5" />
    if (volume < 66) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  // Size icon based on level
  const SizeIcon = () => {
    if (uiSize <= 100) return <Minimize className="h-5 w-5" />
    if (uiSize >= 200) return <Maximize className="h-5 w-5" />
    return <Maximize className="h-5 w-5" />
  }

  // Apply size scaling to the interface
  const sizeStyle = {
    transform: `scale(${uiSize / 100})`,
    transformOrigin: "center bottom",
  }

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  // Active button style
  const activeButtonStyle = (isActive: boolean, color: string) => {
    return isActive ? { backgroundColor: color, borderColor: "rgba(255, 255, 255, 0.2)", color: "white" } : buttonStyle
  }

  // Settings panel background style
  const settingsPanelStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  }

  return (
    <>
      {/* Cabin Background Image */}
      <CabinBackground />

      {/* Modern floating controls */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50">
        <DraggableWindow
          title="Translation Controls"
          className="bg-transparent"
          variant={isCollapsed ? "minimal" : "default"}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                className="blur-panel p-6 rounded-3xl"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center mb-1">
                    <button
                      onClick={() => setIsCollapsed(true)}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blur-light transition-colors"
                      style={buttonStyle}
                    >
                      <ChevronDown className="h-5 w-5 text-white/70" />
                    </button>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full shadow-lg text-lg py-6 px-5 font-medium ${
                          mode === "audio" ? "animate-pulse-subtle" : ""
                        }`}
                        style={activeButtonStyle(mode === "audio", "rgba(59, 130, 246, 0.7)")}
                        onClick={handleAudioTranslate}
                        disabled={isProcessing && mode !== "audio"}
                      >
                        {isProcessing && mode === "audio" ? (
                          <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        ) : (
                          <Mic className="h-6 w-6 mr-2 text-white/90" />
                        )}
                        Speech to Text
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full shadow-lg text-lg py-6 px-5 font-medium ${
                          mode === "visual" ? "" : ""
                        }`}
                        style={activeButtonStyle(mode === "visual", "rgba(34, 197, 94, 0.7)")}
                        onClick={handleVisualTranslate}
                        disabled={isProcessing && mode !== "visual"}
                      >
                        {isProcessing && mode === "visual" ? (
                          <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        ) : (
                          <Hand className="h-6 w-6 mr-2 text-white/90" />
                        )}
                        Sign to Text
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className={`rounded-full shadow-lg text-lg py-6 px-5 font-medium ${
                          mode === "audio-to-sign" ? "" : ""
                        }`}
                        style={activeButtonStyle(mode === "audio-to-sign", "rgba(168, 85, 247, 0.7)")}
                        onClick={handleAudioToSignTranslate}
                        disabled={isProcessing && mode !== "audio-to-sign"}
                      >
                        {isProcessing && mode === "audio-to-sign" ? (
                          <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="h-6 w-6 mr-2 text-white/90" />
                        )}
                        Speech to Sign
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        style={buttonStyle}
                        onClick={() => setShowSettings(true)}
                      >
                        <Settings className="h-5 w-5 text-white/90" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                className="p-3 rounded-full"
                style={buttonStyle}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsCollapsed(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-white/90 font-medium">Translation Controls</span>
                  <ChevronUp className="h-4 w-4 text-white/70" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DraggableWindow>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-40 pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            <DraggableWindow 
              title="Settings" 
              className="bg-transparent w-[450px] mx-auto"
              initialPosition={{ 
                x: Math.max(10, Math.min(window.innerWidth - 460, window.innerWidth / 2 - 225)),
                y: Math.max(10, Math.min(window.innerHeight - 460, window.innerHeight / 2 - 250))
              }}
              onPositionChange={setSettingsPosition}
              variant="icon-only"
            >
              <div 
                className="relative blur-panel p-6 pt-10 rounded-3xl text-white w-[450px] max-w-full overflow-hidden"
                style={settingsPanelStyle}
                aria-labelledby="settings-title"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 id="settings-title" className="text-2xl font-semibold text-white">Settings</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    style={buttonStyle}
                    onClick={() => setShowSettings(false)}
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5 text-white/90" />
                  </Button>
                </div>

                <div className="space-y-8 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-3">
                    <Label htmlFor="source-language" className="text-lg font-medium text-white/90">
                      Source Language
                    </Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                      <SelectTrigger id="source-language" className="text-lg h-14 rounded-xl" style={buttonStyle}>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="border-blur-border text-white text-lg" style={settingsPanelStyle}>
                        <SelectItem value="auto">Auto Detect</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target-language" className="text-lg font-medium text-white/90">
                      Target Language
                    </Label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger id="target-language" className="text-lg h-14 rounded-xl" style={buttonStyle}>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="border-blur-border text-white text-lg" style={settingsPanelStyle}>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume" className="text-lg font-medium text-white/90">
                        Volume
                      </Label>
                      <div className="p-1.5 rounded-full" style={buttonStyle}>
                        <VolumeIcon />
                      </div>
                    </div>
                    <div className="blur-slider-track">
                      <Slider
                        id="volume"
                        min={0}
                        max={100}
                        step={1}
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        className="[&>span]:bg-white/70 [&>span]:h-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Off</span>
                      <span>{volume}%</span>
                      <span>Max</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="brightness" className="text-lg font-medium text-white/90">
                      Display Brightness
                    </Label>
                    <div className="blur-slider-track">
                      <Slider
                        id="brightness"
                        min={0}
                        max={100}
                        step={1}
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        className="[&>span]:bg-white/70 [&>span]:h-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Low</span>
                      <span>{brightness}%</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* UI Size Adjustment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ui-size" className="text-lg font-medium text-white/90">
                        UI Size
                      </Label>
                      <div className="p-1.5 rounded-full" style={buttonStyle}>
                        <SizeIcon />
                      </div>
                    </div>
                    <div className="blur-slider-track">
                      <Slider
                        id="ui-size"
                        min={50}
                        max={250}
                        step={5}
                        value={[uiSize]}
                        onValueChange={(value) => setUiSize(value[0])}
                        className="[&>span]:bg-white/70 [&>span]:h-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Smaller</span>
                      <span>{uiSize}%</span>
                      <span>Larger</span>
                    </div>
                  </div>
                </div>
              </div>
            </DraggableWindow>
          </div>
        </div>
      )}
    </>
  )
}

