import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Clean URL
    const cleanUrl = url.trim()

    // Try tikwm.com API (free, no limit)
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

    const data = await response.json()

    if (!data || data.code !== 0) {
      return NextResponse.json({ 
        error: data?.msg || 'Video not found. Make sure the link is public and valid.' 
      }, { status: 404 })
    }

    const videoData = data.data

    return NextResponse.json({
      success: true,
      video: {
        title: videoData.title || 'TikTok Video',
        cover: videoData.cover || videoData.origin_cover || null,
        author: {
          name: videoData.author?.nickname || videoData.author?.unique_id || 'Unknown',
          avatar: videoData.author?.avatar || null,
        },
        hdPlay: videoData.hdplay || videoData.play || null,
        play: videoData.play || null,
        music: videoData.music || null,
        duration: videoData.duration || 0,
        size: videoData.size || 0,
      },
    })
  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
