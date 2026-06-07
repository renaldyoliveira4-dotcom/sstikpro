import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIP(request)
    if (!checkRateLimit(ip, 20, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    // Use tikwm.com with correct field mapping
    const response = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.tikwm.com/',
        },
      }
    )

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Failed to parse response.' }, { status: 500 })
    }

    if (!data || data.code !== 0) {
      return NextResponse.json({ 
        error: 'Video not found. Make sure the link is public.' 
      }, { status: 404 })
    }

    const v = data.data

    // tikwm fields:
    // v.play      = SD video without watermark (MP4)
    // v.hdplay    = HD video without watermark (MP4) 
    // v.wmplay    = video WITH watermark (MP4)
    // v.music     = audio only (MP3)
    // v.music_info = music metadata

    // NEVER use hdplay if it equals music URL
    const musicUrl = v.music || null
    const videoSD = v.play || null  // Always a video
    
    // hdplay is HD video - but verify it's different from music
    let videoHD = v.hdplay || null
    if (videoHD === musicUrl) {
      videoHD = videoSD // fallback to SD if hdplay == music
    }
    // Also check if hdplay URL contains audio indicators
    if (videoHD && musicUrl && videoHD === musicUrl) {
      videoHD = videoSD
    }

    console.log('[tikwm fields]', {
      play: videoSD?.substring(0,80),
      hdplay: videoHD?.substring(0,80),
      music: musicUrl?.substring(0,80),
      areEqual: videoHD === musicUrl,
    })

    return NextResponse.json({
      success: true,
      video: {
        title: v.title || 'TikTok Video',
        cover: v.cover || v.origin_cover || null,
        author: {
          name: v.author?.nickname || v.author?.unique_id || 'Unknown',
          avatar: v.author?.avatar || null,
        },
        hdPlay: videoHD,   // HD MP4 video
        play: videoSD,     // SD MP4 video  
        music: musicUrl,   // MP3 audio
        duration: v.duration || 0,
      },
    })

  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
