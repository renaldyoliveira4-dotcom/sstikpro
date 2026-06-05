import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const filename = searchParams.get('filename') || 'sstikpro-video.mp4'
    const type = searchParams.get('type') || 'video' // 'video' or 'audio'

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const decodedUrl = decodeURIComponent(url)

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': type === 'audio' ? 'audio/*' : 'video/*,*/*',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
    }

    const buffer = await response.arrayBuffer()

    // Force correct content type based on type parameter
    const contentType = type === 'audio' ? 'audio/mpeg' : 'video/mp4'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('[Proxy Error]', error)
    return NextResponse.json({ error: 'Failed to download' }, { status: 500 })
  }
}
