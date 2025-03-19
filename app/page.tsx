"use client"

import HoloLensView from "@/components/hololens-view"
import InterfaceControls from "@/components/interface-controls"
import SizeAdjustmentButton from "@/components/size-adjustment-button"
import { TranslationProvider } from "@/components/translation-context"
import { BackgroundProvider } from "@/components/background-context"
import DynamicBackground from "@/components/dynamic-background"
import CameraToggleButton from "@/components/camera-toggle-button"

export default function Home() {
  return (
    <BackgroundProvider>
      <main className="w-full h-screen bg-black overflow-hidden">
        <TranslationProvider>
          <DynamicBackground />
          <HoloLensView />
          <InterfaceControls />
          <SizeAdjustmentButton />
          <CameraToggleButton />
        </TranslationProvider>
      </main>
    </BackgroundProvider>
  )
}

