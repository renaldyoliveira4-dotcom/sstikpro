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

// ===== META CONVERSIONS API =====
async function sendMeta(eventName: string, data?: Record<string, unknown>) {
  try {
    // Get fbp and fbc cookies
    const fbp = typeof document !== 'undefined' 
      ? document.cookie.match(/_fbp=([^;]+)/)?.[1] || undefined
      : undefined
    const fbc = typeof document !== 'undefined'
      ? document.cookie.match(/_fbc=([^;]+)/)?.[1] || undefined
      : undefined

    await fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_source_url: typeof window !== 'undefined' ? window.location.href : 'https://sstikpro.com.br',
        fbc,
        fbp,
        custom_data: data,
      }),
    })
  } catch {}
}

export function trackMetaPageView() {
  sendMeta('PageView')
}

export function trackMetaDownload(platform: string) {
  sendMeta('Lead', { platform, content_name: `download_${platform}` })
}

export function trackMetaViewContent(platform: string) {
  sendMeta('ViewContent', { platform, content_name: `view_${platform}` })
}
