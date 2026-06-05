import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    // Using tikwm.com - free, no API key needed
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tikwm.com/',
        'Origin': 'https://www.tikwm.com',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to process video. Please try again.' 
      }, { status: 500 })
    }

    const text = await response.text()
    
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ 
        error: 'Failed to parse response. Please try again.' 
      }, { status: 500 })
    }

    if (!data || data.code !== 0) {
      return NextResponse.json({ 
        error: data?.msg || 'Video not found. Check if the link is public.' 
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
      },
    })

  } catch (error) {
    console.error('[Download API Error]', error)
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 })
  }
}
