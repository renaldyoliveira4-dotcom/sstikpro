import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

const RAPIDAPI_KEY = '892d78fc6emshf30864c5fee92d5p15a518jsn3c1faa1ce10e'

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request)
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const { url } = await request.json()
    if (!url?.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()
    const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')
    if (!isYouTube) {
      return NextResponse.json({ error: 'Please enter a valid YouTube URL.' }, { status: 400 })
    }

    const videoId = cleanUrl.match(/(?:v=|youtu\.be\/|shorts\/)([^&?\s]+)/)?.[1]
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL.' }, { status: 400 })
    }

    // Try YTStream API
    const res = await fetch(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`,
      {
        headers: {
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) {
      console.error('[YTStream] Status:', res.status, await res.text())
      return NextResponse.json({ error: 'Failed to fetch video.' }, { status: 500 })
    }

    const data = await res.json()
    console.log('[YTStream] Response keys:', Object.keys(data || {}))
    console.log('[YTStream] Status:', data?.status)

    if (!data || data.status === 'FAIL' || data.status === 'ERROR') {
      return NextResponse.json({ error: 'Video not found or unavailable.' }, { status: 404 })
    }

    // YTStream returns formats with direct download URLs
    const formats = data.formats || data.adaptFormats || []
    const allFormats = [...(data.formats || []), ...(data.adaptFormats || [])]

    console.log('[YTStream] Formats count:', allFormats.length)

    // Find best MP4 with audio (mimeType contains video/mp4 and audio)
    const videoWithAudio = allFormats
      .filter((f: { mimeType?: string; url?: string; qualityLabel?: string }) => 
        f.mimeType?.includes('video/mp4') && f.url && f.qualityLabel
      )
      .sort((a: { qualityLabel?: string }, b: { qualityLabel?: string }) => {
        const qa = parseInt(a.qualityLabel || '0')
        const qb = parseInt(b.qualityLabel || '0')
        return qb - qa
      })

    const best = videoWithAudio[0]

    if (!best?.url) {
      console.error('[YTStream] No valid format found')
      return NextResponse.json({ error: 'No downloadable format found.' }, { status: 404 })
    }

    const thumbnail = data.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    return NextResponse.json({
      success: true,
      video: {
        title: data.title || 'YouTube Video',
        cover: thumbnail,
        author: { name: data.channelTitle || 'YouTube', avatar: null },
        hdPlay: best.url,
        play: best.url,
        music: null,
        duration: parseInt(data.lengthSeconds || '0'),
      },
    })

  } catch (error) {
    console.error('[YouTube Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
