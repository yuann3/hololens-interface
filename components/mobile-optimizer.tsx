"use client"

import { useEffect } from 'react'
import { addMobileClass } from '@/lib/mobile'

export default function MobileOptimizer() {
  useEffect(() => {
    // Apply mobile detection on component mount
    addMobileClass();
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force redraw to correct any layout issues
      document.body.style.display = 'none';
      setTimeout(() => {
        document.body.style.display = '';
      }, 10);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);
  
  return null; // No UI rendered
} 