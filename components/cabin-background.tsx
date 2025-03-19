"use client"

import { motion } from "framer-motion"

export default function CabinBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
      {/* Cabin interior background image with enhanced styling */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CleanShot%202025-03-18%20at%2020.26.20%402x-twu53i1LQewfLSsQK7kHQGbxj82NRO.png)`,
        }}
      >
        {/* Darkening overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.5)_100%)]"></div>

        {/* Animated light rays */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Additional gradient for better UI visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </motion.div>
    </div>
  )
}

