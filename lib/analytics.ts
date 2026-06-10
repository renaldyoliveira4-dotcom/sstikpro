// lib/analytics.ts - GA4 + Supabase events

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-P4RV812JP4'

// Send to GA4
function sendGA4(eventName: string, params?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined' || !window.gtag) return
    window.gtag('event', eventName, { send_to: GA_ID, ...params })
  } catch {}
}

// Send to Supabase
async function sendSupabase(eventName: string, data?: Record<string, unknown>) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: eventName, ...data }),
    })
  } catch {}
}

// Combined event
function track(eventName: string, params?: Record<string, unknown>) {
  sendGA4(eventName, params)
  sendSupabase(eventName, params)
}

// ===== EVENTOS =====

export function trackLinkColado(platform: string, url: string) {
  try {
    track('link_colado', {
      platform,
      url_domain: new URL(url).hostname,
      event_category: 'engagement',
    })
  } catch {
    track('link_colado', { platform, event_category: 'engagement' })
  }
}

export function trackCliqueBaixar(platform: string) {
  track('clique_baixar', {
    platform,
    event_category: 'engagement',
  })
}

export function trackDownloadSucesso(platform: string, quality: string) {
  track('download_sucesso', {
    platform,
    quality,
    event_category: 'conversion',
    value: 1,
  })
}

export function trackDownloadErro(platform: string, errorMsg: string) {
  track('download_erro', {
    platform,
    error_message: errorMsg,
    event_category: 'error',
  })
}

export function trackPageView(path: string) {
  sendGA4('page_view', {
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
  })
}

export function trackPlatformSwitch(from: string, to: string) {
  track('platform_switch', {
    from_platform: from,
    to_platform: to,
    event_category: 'engagement',
  })
}

export function trackPWAInstall(outcome: 'accepted' | 'dismissed') {
  track('pwa_install', { outcome, event_category: 'engagement' })
}

export function trackTelegramClick() {
  track('telegram_click', { event_category: 'social' })
}
// ===== META PIXEL (Client-side) =====
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}

function sendFbq(eventName: string, params?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined' || !window.fbq) return
    window.fbq('track', eventName, params)
  } catch {}
}

export function trackMetaPageView() {
  sendFbq('PageView')
}

export function trackMetaDownload(platform: string) {
  sendFbq('Lead', { content_name: platform, content_category: 'download' })
}

export function trackMetaViewContent(platform: string) {
  sendFbq('ViewContent', { content_name: platform })
}
