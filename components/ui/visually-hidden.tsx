"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        // Visually hidden but accessible to screen readers
        "clip-rect-0 m-[-1px]",
        className
      )}
      {...props}
    />
  )
})
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden } 