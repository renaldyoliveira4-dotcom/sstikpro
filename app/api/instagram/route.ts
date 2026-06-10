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
    const isInstagram = cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')
    if (!isInstagram) {
      return NextResponse.json({ error: 'Please enter a valid Instagram URL.' }, { status: 400 })
    }

    const res = await fetch(
      `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${encodeURIComponent(cleanUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!res.ok) {
      console.error('[Instagram API] Status:', res.status)
      return NextResponse.json({ error: 'Failed to fetch video.' }, { status: 500 })
    }

    const data = await res.json()
    console.log('[Instagram API] Success:', data?.success, 'medias:', data?.data?.medias?.length)

    if (!data?.success || !data?.data) {
      return NextResponse.json({ error: 'Video not found or account is private.' }, { status: 404 })
    }

    const d = data.data

    // Get video media
    const videoMedia = d.medias?.find((m: { type: string }) => m.type === 'video')

    if (!videoMedia?.url) {
      return NextResponse.json({ error: 'No video found. Make sure it is a public Reel.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      video: {
        title: d.title || 'Instagram Reel',
        cover: d.thumbnail || null,
        author: {
          name: d.owner?.full_name || d.author || d.owner?.username || 'Instagram',
          avatar: d.owner?.profile_pic_url || null,
        },
        hdPlay: videoMedia.url,
        play: videoMedia.url,
        music: null,
        duration: d.duration || 0,
      },
    })

  } catch (error) {
    console.error('[Instagram Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
