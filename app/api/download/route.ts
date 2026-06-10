import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'
import { downloadWithCobalt } from '@/lib/cobalt'

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request)
    if (!checkRateLimit(ip, 20, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { url } = await request.json()

    if (!url?.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    // Primary: tikwm.com (best for TikTok - no watermark, HD)
    try {
      const response = await fetch(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Referer': 'https://www.tikwm.com/',
          },
          signal: AbortSignal.timeout(10000),
        }
      )

      if (response.ok) {
        const text = await response.text()
        const data = JSON.parse(text)

        if (data?.code === 0 && data?.data) {
          const v = data.data
          const videoSD = v.play || null
          const videoHD = v.hdplay || videoSD
          const musicUrl = v.music || null
          const finalHD = (videoHD && videoHD !== musicUrl) ? videoHD : videoSD

          if (finalHD || videoSD) {
            return NextResponse.json({
              success: true,
              video: {
                title: v.title || 'TikTok Video',
                cover: v.cover || v.origin_cover || null,
                author: {
                  name: v.author?.nickname || v.author?.unique_id || 'Unknown',
                  avatar: v.author?.avatar || null,
                },
                hdPlay: finalHD,
                play: videoSD,
                music: musicUrl,
                duration: v.duration || 0,
              },
            })
          }
        }
      }
    } catch {
      // tikwm failed, try Cobalt
    }

    // Fallback: Cobalt API
    const cobaltResult = await downloadWithCobalt(cleanUrl)
    if (cobaltResult) {
      return NextResponse.json({ success: true, video: cobaltResult })
    }

    return NextResponse.json({
      error: 'Video not found. Make sure the link is public and valid.'
    }, { status: 404 })

  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
