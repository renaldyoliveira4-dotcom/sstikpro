import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    // Validate Instagram URL
    const isInstagram = cleanUrl.includes('instagram.com') || 
                        cleanUrl.includes('instagr.am')

    if (!isInstagram) {
      return NextResponse.json({ error: 'Please enter a valid Instagram URL.' }, { status: 400 })
    }

    // Use tikwm.com - supports Instagram too
    const response = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.tikwm.com/',
        },
        next: { revalidate: 0 }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch video.' }, { status: 500 })
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Failed to parse response.' }, { status: 500 })
    }

    if (!data || data.code !== 0) {
      // Try fallback with snapinsta API
      return await fallbackInstagram(cleanUrl)
    }

    const v = data.data
    const videoSD = v.play || null
    const videoHD = v.hdplay || videoSD
    const musicUrl = v.music || null

    const finalHD = (videoHD && videoHD !== musicUrl) ? videoHD : videoSD

    return NextResponse.json({
      success: true,
      video: {
        title: v.title || 'Instagram Video',
        cover: v.cover || v.origin_cover || null,
        author: {
          name: v.author?.nickname || v.author?.unique_id || 'Instagram',
          avatar: v.author?.avatar || null,
        },
        hdPlay: finalHD,
        play: videoSD,
        music: musicUrl,
        duration: v.duration || 0,
      },
    })

  } catch (error) {
    console.error('[Instagram Download Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

async function fallbackInstagram(url: string): Promise<NextResponse> {
  try {
    // Extract shortcode from URL
    const shortcode = url.match(/\/(p|reels?|tv)\/([^/?]+)/)?.[2]
    if (!shortcode) {
      return NextResponse.json({ error: 'Invalid Instagram URL.' }, { status: 400 })
    }

    // Use instagram-reels-downloader API
    const response = await fetch(
      `https://instagram-reels-downloader-tau.vercel.app/api/video?postUrl=${encodeURIComponent(url)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(8000),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Video not found or private account.' }, { status: 404 })
    }

    const data = await response.json()

    if (!data?.data?.videoUrl) {
      return NextResponse.json({ error: 'Could not get download link.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      video: {
        title: data.data.title || 'Instagram Video',
        cover: data.data.thumbnail || null,
        author: {
          name: data.data.author?.username || 'Instagram',
          avatar: data.data.author?.profile_pic_url || null,
        },
        hdPlay: data.data.videoUrl,
        play: data.data.videoUrl,
        music: null,
        duration: data.data.duration || 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process Instagram video.' }, { status: 500 })
  }
}
