'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  placement: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Desktop banner 728x90
function DesktopBanner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const script1 = document.createElement('script')
    script1.innerHTML = `
      atOptions = {
        'key': '5198d8740f1a9251e4f1642b0adba0ee',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
    `
    const script2 = document.createElement('script')
    script2.src = 'https://www.highperformanceformat.com/5198d8740f1a9251e4f1642b0adba0ee/invoke.js'
    script2.async = true

    ref.current.appendChild(script1)
    ref.current.appendChild(script2)
  }, [])

  return <div ref={ref} style={{ minHeight: 90, display: 'flex', justifyContent: 'center' }} />
}

// Mobile banner 320x50
function MobileBanner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const script1 = document.createElement('script')
    script1.innerHTML = `
      atOptions = {
        'key': '9b6b6d17247168ab7eab552b2c893377',
        'format': 'iframe',
        'height': 50,
        'width': 320,
        'params': {}
      };
    `
    const script2 = document.createElement('script')
    script2.src = 'https://www.highperformanceformat.com/9b6b6d17247168ab7eab552b2c893377/invoke.js'
    script2.async = true

    ref.current.appendChild(script1)
    ref.current.appendChild(script2)
  }, [])

  return <div ref={ref} style={{ minHeight: 50, display: 'flex', justifyContent: 'center' }} />
}

export default function AdBanner({ placement, size = 'md', className = '' }: AdBannerProps) {
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopBanner />
      </div>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileBanner />
      </div>
    </div>
  )
}
