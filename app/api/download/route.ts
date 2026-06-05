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

    // play = SD video, hdplay = HD video, music = audio only
    // Make sure we never mix video and audio fields
    const videoSD = v.play || null        // SD video (no watermark)
    const videoHD = v.hdplay || null      // HD video (no watermark)
    const musicUrl = v.music || null      // Audio only (MP3)

    return NextResponse.json({
      success: true,
      video: {
        title: v.title || 'TikTok Video',
        cover: v.cover || v.origin_cover || null,
        author: {
          name: v.author?.nickname || v.author?.unique_id || 'Unknown',
          avatar: v.author?.avatar || null,
        },
        hdPlay: videoHD,    // HD video
        play: videoSD,      // SD video
        music: musicUrl,    // Audio MP3
        duration: v.duration || 0,
      },
    })
  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
