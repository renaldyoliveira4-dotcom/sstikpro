import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    const response = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.tikwm.com/',
        },
        next: { revalidate: 0 }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch video. Please try again.' }, { status: 500 })
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Failed to parse response.' }, { status: 500 })
    }

    if (!data || data.code !== 0) {
      return NextResponse.json({ 
        error: data?.msg || 'Video not found. Make sure the link is public and valid.' 
      }, { status: 404 })
    }

    const v = data.data

    // Log all fields to debug
    console.log('[TikWM Response Fields]', {
      play: v.play?.substring(0, 60),
      hdplay: v.hdplay?.substring(0, 60),
      wmplay: v.wmplay?.substring(0, 60),
      music: v.music?.substring(0, 60),
      origin_cover: v.origin_cover?.substring(0, 60),
    })

    // play = SD video without watermark
    // hdplay = HD video without watermark  
    // wmplay = video WITH watermark
    // music = audio only
    
    // Ensure hdplay is a video URL (contains .mp4 or /video/)
    let videoHD = v.hdplay || null
    let videoSD = v.play || null
    const musicUrl = v.music || null

    // If hdplay looks like audio (contains /music/ or .mp3), use play instead
    if (videoHD && (videoHD.includes('/music/') || videoHD.includes('.mp3'))) {
      videoHD = videoSD
    }

    return NextResponse.json({
      success: true,
      video: {
        title: v.title || 'TikTok Video',
        cover: v.cover || v.origin_cover || null,
        author: {
          name: v.author?.nickname || v.author?.unique_id || 'Unknown',
          avatar: v.author?.avatar || null,
        },
        hdPlay: videoHD,
        play: videoSD,
        music: musicUrl,
        duration: v.duration || 0,
      },
    })
  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
