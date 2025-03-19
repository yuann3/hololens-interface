"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GripHorizontal } from "lucide-react"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface DraggableWindowProps {
  children: React.ReactNode
  title?: string
  initialPosition?: { x: number; y: number }
  onPositionChange?: (position: { x: number; y: number }) => void
  className?: string
  variant?: "default" | "minimal" | "centered" | "icon-only" | "settings"
}

export default function DraggableWindow({
  children,
  title,
  initialPosition = { x: 0, y: 0 },
  onPositionChange,
  className = "",
  variant = "default",
}: DraggableWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    e.preventDefault() // Prevent text selection during drag
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setStartPos({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
    // Prevent page scrolling while dragging on mobile
    e.preventDefault();
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newPosition = {
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    }

    setPosition(newPosition)
    if (onPositionChange) onPositionChange(newPosition)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const newPosition = {
      x: touch.clientX - startPos.x,
      y: touch.clientY - startPos.y,
    }

    // Ensure window stays within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    newPosition.x = Math.max(0, Math.min(newPosition.x, viewportWidth - 100));
    newPosition.y = Math.max(0, Math.min(newPosition.y, viewportHeight - 100));

    setPosition(newPosition)
    if (onPositionChange) {
      onPositionChange(newPosition)
    }
    e.preventDefault(); // Prevent scrolling during drag
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    // Only add event listeners when dragging to improve performance
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleDragEnd)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging, startPos, position, onPositionChange])

  // Common button style to match "Drag to move" button
  const buttonStyle = {
    backgroundColor: "rgba(40, 40, 40, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        x: { duration: isDragging ? 0 : 0.2 },
        y: { duration: isDragging ? 0 : 0.2 },
      }}
      className={className}
      role="dialog"
      aria-labelledby={title ? "draggable-window-title" : undefined}
    >
      {title && (
        <VisuallyHidden id="draggable-window-title">{title}</VisuallyHidden>
      )}
      
      {variant === "default" && (
        <div
          className="flex items-center justify-center mb-4"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-blur-border"
            style={buttonStyle}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(60, 60, 60, 0.75)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GripHorizontal className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/90 font-medium">Drag to move</span>
          </motion.div>
        </div>
      )}

      {variant === "centered" && (
        <div
          className="absolute top-0 left-0 right-0 -translate-y-6 flex items-center justify-center z-10"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-blur-border"
            style={buttonStyle}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(60, 60, 60, 0.75)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GripHorizontal className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white/90 font-medium">Drag to move</span>
          </motion.div>
        </div>
      )}

      {variant === "icon-only" && (
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 flex items-center justify-center z-10"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="backdrop-blur-xl p-2 rounded-full flex items-center justify-center border border-blur-border"
            style={buttonStyle}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(60, 60, 60, 0.75)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GripHorizontal className="h-4 w-4 text-white/70" />
          </motion.div>
        </div>
      )}

      {variant === "settings" && (
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="backdrop-blur-xl p-2 rounded-full flex items-center justify-center border border-blur-border"
            style={buttonStyle}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(60, 60, 60, 0.75)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GripHorizontal className="h-4 w-4 text-white/70" />
          </motion.div>
        </div>
      )}

      {variant === "minimal" && (
        <div
          className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className="w-16 h-1 bg-white/20 rounded-full" />
        </div>
      )}

      {children}
    </motion.div>
  )
}

