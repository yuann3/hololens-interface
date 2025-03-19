"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function CameraBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const startCamera = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        })
        
        // Only proceed if component is still mounted
        if (!mounted) return
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          // Mark as loaded when video can play
          videoRef.current.onloadedmetadata = () => {
            if (mounted) setIsLoaded(true)
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startCamera()

    // Clean up function
    return () => {
      mounted = false
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-20 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Video element with camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute w-full h-full object-cover"
        />
        
        {/* Overlay for better UI visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.5)_100%)]"></div>
      </motion.div>
    </div>
  )
} 