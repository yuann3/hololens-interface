"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type TranslationMode = "idle" | "audio" | "visual" | "audio-to-sign"
type TranslationStatus = "idle" | "listening" | "translating" | "complete"

interface TranslationContextType {
  mode: TranslationMode
  setMode: (mode: TranslationMode) => void
  status: TranslationStatus
  setStatus: (status: TranslationStatus) => void
  translatedText: string
  setTranslatedText: (text: string) => void
  sourceLanguage: string
  setSourceLanguage: (language: string) => void
  targetLanguage: string
  setTargetLanguage: (language: string) => void
  volume: number
  setVolume: (volume: number) => void
  brightness: number
  setBrightness: (brightness: number) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  showSignGuide: boolean
  setShowSignGuide: (show: boolean) => void
  signGuideStep: number
  setSignGuideStep: (step: number) => void
  recognizedWords: string[]
  setRecognizedWords: (words: string[]) => void
  recognizedGestures: string[]
  setRecognizedGestures: (gestures: string[]) => void
  audioAmplitude: number
  setAudioAmplitude: (amplitude: number) => void
  showVisualOverlay: boolean
  setShowVisualOverlay: (show: boolean) => void
  signGuideVisible: boolean
  setSignGuideVisible: (visible: boolean) => void
  signGuideReady: boolean
  setSignGuideReady: (ready: boolean) => void
  audioToSignMode: boolean
  setAudioToSignMode: (enabled: boolean) => void
  currentSignSequence: string[]
  setCurrentSignSequence: (sequence: string[]) => void
  spokenPhrase: string
  setSpokenPhrase: (phrase: string) => void
  uiSize: number
  setUiSize: (size: number) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TranslationMode>("idle")
  const [status, setStatus] = useState<TranslationStatus>("idle")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("auto")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [volume, setVolume] = useState(80)
  const [brightness, setBrightness] = useState(70)
  const [showSettings, setShowSettings] = useState(false)
  const [showSignGuide, setShowSignGuide] = useState(false)
  const [signGuideStep, setSignGuideStep] = useState(0)
  const [recognizedWords, setRecognizedWords] = useState<string[]>([])
  const [recognizedGestures, setRecognizedGestures] = useState<string[]>([])
  const [audioAmplitude, setAudioAmplitude] = useState(0)
  const [showVisualOverlay, setShowVisualOverlay] = useState(false)
  const [signGuideVisible, setSignGuideVisible] = useState(false)
  const [signGuideReady, setSignGuideReady] = useState(false)
  const [audioToSignMode, setAudioToSignMode] = useState(false)
  const [currentSignSequence, setCurrentSignSequence] = useState<string[]>([])
  const [spokenPhrase, setSpokenPhrase] = useState("")
  const [uiSize, setUiSize] = useState(150) // Default size is 150%

  return (
    <TranslationContext.Provider
      value={{
        mode,
        setMode,
        status,
        setStatus,
        translatedText,
        setTranslatedText,
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
        showSignGuide,
        setShowSignGuide,
        signGuideStep,
        setSignGuideStep,
        recognizedWords,
        setRecognizedWords,
        recognizedGestures,
        setRecognizedGestures,
        audioAmplitude,
        setAudioAmplitude,
        showVisualOverlay,
        setShowVisualOverlay,
        signGuideVisible,
        setSignGuideVisible,
        signGuideReady,
        setSignGuideReady,
        audioToSignMode,
        setAudioToSignMode,
        currentSignSequence,
        setCurrentSignSequence,
        spokenPhrase,
        setSpokenPhrase,
        uiSize,
        setUiSize,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

