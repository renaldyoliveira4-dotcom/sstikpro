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

    // Extract video ID
    const videoId = cleanUrl.match(/(?:v=|youtu\.be\/|shorts\/)([^&?\s]+)/)?.[1]
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL.' }, { status: 400 })
    }

    // Use YouTube Search and Download API
    const res = await fetch(
      `https://youtube-search-and-download.p.rapidapi.com/video?id=${videoId}`,
      {
        headers: {
          'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!res.ok) {
      console.error('[YouTube API] Status:', res.status)
      return NextResponse.json({ error: 'Failed to fetch video info.' }, { status: 500 })
    }

    const data = await res.json()
    console.log('[YouTube API] Got response, title:', data.title)

    if (!data || (!data.formats && !data.adaptiveFormats)) {
      console.error('[YouTube API] No formats in response:', JSON.stringify(data).substring(0, 200))
      return NextResponse.json({ error: 'Video not found or unavailable.' }, { status: 404 })
    }

    // Get best video with audio (formats have both video+audio)
    // formats[] = combined video+audio (360p typically)
    // adaptiveFormats[] = video only or audio only (higher quality but need merging)
    
    // Find best combined format (has both video and audio)
    const combinedFormats = (data.formats || []).filter((f: { mimeType: string; url: string }) => 
      f.mimeType?.includes('video/mp4') && f.url
    )
    
    // Find best quality HD video-only format
    const hdFormats = (data.adaptiveFormats || []).filter((f: { mimeType: string; qualityLabel: string; url: string }) =>
      f.mimeType?.includes('video/mp4') && 
      (f.qualityLabel === '720p' || f.qualityLabel === '1080p') &&
      f.url
    ).sort((a: { qualityLabel: string }, b: { qualityLabel: string }) => 
      parseInt(b.qualityLabel) - parseInt(a.qualityLabel)
    )

    const bestHD = hdFormats[0]
    const bestSD = combinedFormats[0] // 360p with audio

    if (!bestSD && !bestHD) {
      return NextResponse.json({ error: 'No downloadable format found.' }, { status: 404 })
    }

    const thumbnail = data.thumbnail?.[data.thumbnail.length - 1]?.url || 
                      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    return NextResponse.json({
      success: true,
      video: {
        title: data.title || 'YouTube Video',
        cover: thumbnail,
        author: {
          name: data.channelTitle || 'YouTube',
          avatar: null,
        },
        // HD video only (no audio) - use as hdPlay
        hdPlay: bestHD?.url || bestSD?.url || null,
        // SD combined (video+audio) - use as play
        play: bestSD?.url || null,
        music: null,
        duration: parseInt(data.lengthSeconds || '0'),
      },
    })

  } catch (error) {
    console.error('[YouTube Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
