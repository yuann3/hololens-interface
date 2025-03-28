"use client"

import { useEffect, useRef, useState } from "react"

interface YouTubePlayerProps {
  videoId: string
  autoplay?: boolean
  mute?: boolean
  loop?: boolean
  width?: number
  height?: number
  className?: string
}

export default function YouTubePlayer({
  videoId,
  autoplay = true,
  mute = true,
  loop = true,
  width = 300,
  height = 300,
  className = "",
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true)
    }

    if (playerRef.current) {
      playerRef.current.addEventListener("load", handleLoad)
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener("load", handleLoad)
      }
    }
  }, [])

  // Create YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoplay ? 1 : 0
  }&mute=${mute ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}&controls=0`

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <iframe
        ref={playerRef}
        width={width}
        height={height}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`rounded-xl w-full h-full ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transition: "opacity 0.3s ease" }}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="w-8 h-8 border-4 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
} 