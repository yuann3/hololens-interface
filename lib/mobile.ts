"use client";

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for touch support
  const hasTouchSupport = 
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0;
    
  // Check viewport width
  const isSmallViewport = window.innerWidth <= 768;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  
  return hasTouchSupport && (isSmallViewport || isMobileDevice);
}

export function addMobileClass(): void {
  if (typeof document === 'undefined') return;
  
  if (isMobile()) {
    document.documentElement.classList.add('mobile');
  } else {
    document.documentElement.classList.remove('mobile');
  }
}

// Hook for components to detect mobile
export function useMobileDetection(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Update on window resize
  const [isMobileView, setIsMobileView] = useState(isMobile());
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
      addMobileClass();
    };
    
    // Set initially
    handleResize();
    
    // Update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobileView;
}

// Don't forget to import these
import { useState, useEffect } from 'react'; 