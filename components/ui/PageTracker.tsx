'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export default function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track in GA4
    trackPageView(pathname)

    // Track in Supabase
    fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {})
  }, [pathname])

  return null
}
