// Media downloader - múltiplas APIs como fallback

interface VideoResult {
  title: string
  cover: string | null
  author: { name: string; avatar: string | null }
  hdPlay: string | null
  play: string | null
  music: string | null
  duration: number
}

// Instâncias públicas do Cobalt que aceitam requests diretos
const COBALT_INSTANCES = [
  'https://cobalt.api.bm4.de',
  'https://cobalt.plexar.io', 
  'https://cob.freebudget.club',
  'https://cobalt.drgns.space',
  'https://cobalt.sv-studios.net',
]

export async function downloadWithCobalt(url: string, quality = '1080'): Promise<VideoResult | null> {
  for (const instance of COBALT_INSTANCES) {
    try {
      const response = await fetch(`${instance}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SSTikPro/1.0)',
        },
        body: JSON.stringify({
          url,
          vQuality: quality,
          aFormat: 'mp3',
          isAudioOnly: false,
          disableMetadata: false,
          filenameStyle: 'pretty',
        }),
        signal: AbortSignal.timeout(12000),
      })

      if (!response.ok) {
        console.log(`[Cobalt] ${instance} returned ${response.status}`)
        continue
      }

      const data = await response.json()
      console.log(`[Cobalt] ${instance} response:`, JSON.stringify(data).substring(0, 150))

      if (!data || data.status === 'error' || data.status === 'rate-limit') continue

      let videoUrl: string | null = null
      let musicUrl: string | null = null

      if (data.status === 'stream' || data.status === 'redirect' || data.status === 'tunnel') {
        videoUrl = data.url || null
        musicUrl = data.audio || null
      } else if (data.status === 'picker' && data.picker) {
        const videoItem = data.picker.find((p: { type: string }) => p.type === 'video') || data.picker[0]
        videoUrl = videoItem?.url || null
      }

      if (!videoUrl) continue

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

    } catch (e) {
      console.log(`[Cobalt] ${instance} error:`, e)
      continue
    }
  }

  return null
}
