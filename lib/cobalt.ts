// Cobalt API - Open source media downloader
// Supports: TikTok, YouTube, Instagram, Twitter, Reddit and 20+ platforms

const COBALT_INSTANCES = [
  'https://cobalt.api.bm4.de',
  'https://api.cobalt.tools',
  'https://cobalt.plexar.io',
]

interface CobaltResponse {
  status: 'stream' | 'redirect' | 'picker' | 'error' | 'rate-limit'
  url?: string
  urls?: string
  filename?: string
  audio?: string
  picker?: Array<{ type: string; url: string; thumb?: string }>
  text?: string
}

interface VideoResult {
  title: string
  cover: string | null
  author: { name: string; avatar: string | null }
  hdPlay: string | null
  play: string | null
  music: string | null
  duration: number
}

export async function downloadWithCobalt(url: string, quality = '1080'): Promise<VideoResult | null> {
  for (const instance of COBALT_INSTANCES) {
    try {
      const response = await fetch(`${instance}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          vQuality: quality,
          aFormat: 'mp3',
          isAudioOnly: false,
          disableMetadata: false,
          filenameStyle: 'pretty',
        }),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) continue

      const data: CobaltResponse = await response.json()

      if (data.status === 'error' || data.status === 'rate-limit') continue

      let videoUrl: string | null = null
      let musicUrl: string | null = null

      if (data.status === 'stream' || data.status === 'redirect') {
        videoUrl = data.url || null
        musicUrl = data.audio || null
      } else if (data.status === 'picker' && data.picker) {
        const videoItem = data.picker.find(p => p.type === 'video') || data.picker[0]
        videoUrl = videoItem?.url || null
      }

      if (!videoUrl) continue

      // Extract filename as title
      const title = data.filename?.replace(/\.[^.]+$/, '') || 'Video'

      return {
        title,
        cover: null,
        author: { name: 'Download', avatar: null },
        hdPlay: videoUrl,
        play: videoUrl,
        music: musicUrl,
        duration: 0,
      }

    } catch {
      continue
    }
  }

  return null
}
