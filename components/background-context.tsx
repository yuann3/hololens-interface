"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type BackgroundType = "cabin" | "camera"

interface BackgroundContextType {
  backgroundType: BackgroundType
  toggleBackground: () => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("cabin")

  const toggleBackground = () => {
    setBackgroundType(prev => (prev === "cabin" ? "camera" : "cabin"))
  }

  return (
    <BackgroundContext.Provider value={{ backgroundType, toggleBackground }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
} 