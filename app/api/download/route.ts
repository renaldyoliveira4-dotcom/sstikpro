import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()
    const apiKey = process.env.RAPIDAPI_KEY || '892d78fc6emshf30864c5fee92d5p15a518jsn3c1faa1ce10e'

    // Use TikTok Unauthorized API - 500K free requests/month
    const response = await fetch(
      'https://tiktok-unauthorized-api-scraper-no-watermark-analytics-feed.p.rapidapi.com/api/post_data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'tiktok-unauthorized-api-scraper-no-watermark-analytics-feed.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
        body: JSON.stringify({ web_link: cleanUrl }),
      }
    )

    if (!response.ok) {
      // Fallback to tikwm if main API fails
      return await fallbackTikwm(cleanUrl)
    }

    const data = await response.json()
    console.log('[API Response]', JSON.stringify(data).substring(0, 300))

    if (!data || data.error) {
      return await fallbackTikwm(cleanUrl)
    }

    // Extract video data from response
    const v = data.data || data

    const videoHD = v.download_url_hd || v.download_url || v.play_url || null
    const videoSD = v.download_url || v.play_url || null
    const musicUrl = v.music_url || v.audio_url || null

    if (!videoHD && !videoSD) {
      return await fallbackTikwm(cleanUrl)
    }

    return NextResponse.json({
      success: true,
      video: {
        title: v.desc || v.title || 'TikTok Video',
        cover: v.cover || v.thumbnail || null,
        author: {
          name: v.author?.nickname || v.author?.unique_id || 'Unknown',
          avatar: v.author?.avatar_thumb?.url_list?.[0] || null,
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

// Fallback to tikwm.com
async function fallbackTikwm(url: string): Promise<NextResponse> {
  try {
    const response = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.tikwm.com/',
        },
      }
    )

    const text = await response.text()
    const data = JSON.parse(text)

    if (!data || data.code !== 0) {
      return NextResponse.json({ error: 'Video not found or unavailable.' }, { status: 404 })
    }

    const v = data.data
    const videoSD = v.play || null
    const videoHD = v.hdplay || videoSD
    const musicUrl = v.music || null

    // Ensure HD is not audio
    const finalHD = (videoHD && !videoHD.includes('/music/') && !videoHD.includes('.mp3')) 
      ? videoHD 
      : videoSD

    return NextResponse.json({
      success: true,
      video: {
        title: v.title || 'TikTok Video',
        cover: v.cover || v.origin_cover || null,
        author: {
          name: v.author?.nickname || 'Unknown',
          avatar: v.author?.avatar || null,
        },
        hdPlay: finalHD,
        play: videoSD,
        music: musicUrl,
        duration: v.duration || 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process video.' }, { status: 500 })
  }
}
