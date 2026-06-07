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

    const apiKey = process.env.RAPIDAPI_KEY || '892d78fc6emshf30864c5fee92d5p15a518jsn3c1faa1ce10e'

    const res = await fetch(
      `https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=${encodeURIComponent(cleanUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
          'x-rapidapi-key': apiKey,
        },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!res.ok) {
      console.error('[Instagram API] Status:', res.status)
      return NextResponse.json({ error: 'Failed to fetch video.' }, { status: 500 })
    }

    const data = await res.json()
    console.log('[Instagram API Response]', JSON.stringify(data).substring(0, 300))

    // Extract video URL - try all possible fields
    const videoUrl = data?.video ||
                     data?.url ||
                     data?.video_url ||
                     data?.download_url ||
                     data?.result?.url ||
                     data?.result?.video ||
                     data?.data?.url ||
                     data?.media?.[0]?.url ||
                     null

    const thumbnail = data?.thumbnail ||
                      data?.image ||
                      data?.cover ||
                      data?.result?.thumbnail ||
                      null

    const title = data?.title ||
                  data?.caption ||
                  data?.description ||
                  'Instagram Video'

    const author = data?.owner?.username ||
                   data?.author ||
                   data?.username ||
                   'Instagram'

    if (!videoUrl) {
      console.error('[Instagram API] No video URL:', JSON.stringify(data))
      return NextResponse.json({
        error: 'Could not get download link. Make sure the account is public.'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      video: {
        title,
        cover: thumbnail,
        author: { name: author, avatar: null },
        hdPlay: videoUrl,
        play: videoUrl,
        music: null,
        duration: data?.duration || 0,
      },
    })

  } catch (error) {
    console.error('[Instagram Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
