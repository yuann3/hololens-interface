"use client"

import { useState } from "react"
import { useTranslation } from "./translation-context"
import { Button } from "@/components/ui/button"
import { Maximize, Minimize, ChevronRight, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"

export default function SizeAdjustmentButton() {
  const { uiSize, setUiSize } = useTranslation()
  const [showSlider, setShowSlider] = useState(false)

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showSlider && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-3 rounded-xl flex items-center gap-3"
            style={buttonStyle}
          >
            <ChevronLeft
              className="h-4 w-4 text-white/80 cursor-pointer"
              onClick={() => setUiSize(Math.max(50, uiSize - 5))}
            />
            <div className="blur-slider-track w-32">
              <Slider
                min={50}
                max={250}
                step={5}
                value={[uiSize]}
                onValueChange={(value) => setUiSize(value[0])}
                className="[&>span]:bg-white/70 [&>span]:h-full"
              />
            </div>
            <ChevronRight
              className="h-4 w-4 text-white/80 cursor-pointer"
              onClick={() => setUiSize(Math.min(250, uiSize + 5))}
            />
            <span className="text-white/90 text-sm min-w-[40px] text-center font-medium">{uiSize}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          style={buttonStyle}
          onClick={() => setShowSlider(!showSlider)}
        >
          {uiSize <= 75 ? (
            <Minimize className="h-5 w-5 text-white/80" />
          ) : uiSize >= 125 ? (
            <Maximize className="h-5 w-5 text-white/80" />
          ) : (
            <Maximize className="h-5 w-5 text-white/80" />
          )}
        </Button>
      </motion.div>
    </div>
  )
}

