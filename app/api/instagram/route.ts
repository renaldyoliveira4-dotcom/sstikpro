import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cleanUrl = url.trim()

    const isInstagram = cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')
    if (!isInstagram) {
      return NextResponse.json({ error: 'Please enter a valid Instagram URL.' }, { status: 400 })
    }

    // Try multiple APIs
    const apis = [
      () => trySnapInstagram(cleanUrl),
      () => tryRapidAPIInstagram(cleanUrl),
    ]

    for (const api of apis) {
      try {
        const result = await api()
        if (result) return result
      } catch {
        continue
      }
    }

    return NextResponse.json({ 
      error: 'Could not download this video. Make sure it is from a public account.' 
    }, { status: 404 })

  } catch (error) {
    console.error('[Instagram Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

async function trySnapInstagram(url: string): Promise<NextResponse | null> {
  try {
    const res = await fetch('https://snapsave.app/action.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://snapsave.app/',
        'Origin': 'https://snapsave.app',
      },
      body: `url=${encodeURIComponent(url)}`,
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return null

    const html = await res.text()

    // Extract video URL from response
    const videoMatch = html.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/)
    if (!videoMatch) return null

    const videoUrl = videoMatch[1].replace(/&amp;/g, '&')

    return NextResponse.json({
      success: true,
      video: {
        title: 'Instagram Video',
        cover: null,
        author: { name: 'Instagram', avatar: null },
        hdPlay: videoUrl,
        play: videoUrl,
        music: null,
        duration: 0,
      },
    })
  } catch {
    return null
  }
}

async function tryRapidAPIInstagram(url: string): Promise<NextResponse | null> {
  try {
    const apiKey = process.env.RAPIDAPI_KEY
    if (!apiKey) return null

    const res = await fetch(
      `https://instagram-reels-and-posts-downloader.p.rapidapi.com/download?url=${encodeURIComponent(url)}`,
      {
        headers: {
          'x-rapidapi-host': 'instagram-reels-and-posts-downloader.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    if (!data?.result?.video_url) return null

    return NextResponse.json({
      success: true,
      video: {
        title: data.result.caption || 'Instagram Video',
        cover: data.result.thumbnail_url || null,
        author: { name: data.result.username || 'Instagram', avatar: null },
        hdPlay: data.result.video_url,
        play: data.result.video_url,
        music: null,
        duration: 0,
      },
    })
  } catch {
    return null
  }
}
