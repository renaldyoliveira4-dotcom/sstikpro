// lib/analytics.ts
// Google Analytics 4 events for SSTikPro

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-P4RV812JP4'

// Base event function
function sendEvent(eventName: string, params?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return
    if (!window.gtag) return

    window.gtag('event', eventName, {
      send_to: GA_ID,
      ...params,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 Event] ${eventName}`, params)
    }
  } catch (error) {
    console.error('[GA4 Error]', error)
  }
}

// ===== EVENTOS SSTIKPRO =====

// 1. Usuário colou um link
export function trackLinkColado(platform: string, url: string) {
  try {
    sendEvent('link_colado', {
      platform,
      url_domain: new URL(url).hostname,
      event_category: 'engagement',
      event_label: platform,
    })
  } catch {
    sendEvent('link_colado', { platform, event_category: 'engagement' })
  }
}

// 2. Usuário clicou em baixar
export function trackCliqueBaixar(platform: string) {
  sendEvent('clique_baixar', {
    platform,
    event_category: 'engagement',
    event_label: platform,
  })
}

// 3. Download concluído com sucesso
export function trackDownloadSucesso(platform: string, quality: string) {
  sendEvent('download_sucesso', {
    platform,
    quality,
    event_category: 'conversion',
    event_label: `${platform}_${quality}`,
    value: 1,
  })
}

// 4. Erro no download
export function trackDownloadErro(platform: string, errorMsg: string) {
  sendEvent('download_erro', {
    platform,
    error_message: errorMsg,
    event_category: 'error',
    event_label: platform,
  })
}

// 5. Visualização de página
export function trackPageView(path: string) {
  sendEvent('page_view', {
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
    event_category: 'navigation',
  })
}

// 6. Clique no botão instalar PWA
export function trackPWAInstall(outcome: 'accepted' | 'dismissed') {
  sendEvent('pwa_install', {
    outcome,
    event_category: 'engagement',
  })
}

// 7. Clique no Telegram
export function trackTelegramClick() {
  sendEvent('telegram_click', {
    event_category: 'social',
    event_label: 'telegram_group',
  })
}

// 8. Troca de plataforma
export function trackPlatformSwitch(from: string, to: string) {
  sendEvent('platform_switch', {
    from_platform: from,
    to_platform: to,
    event_category: 'engagement',
  })
}
