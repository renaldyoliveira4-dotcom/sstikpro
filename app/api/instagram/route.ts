import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'
import { downloadWithCobalt } from '@/lib/cobalt'

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

    // Try Cobalt API
    const result = await downloadWithCobalt(cleanUrl)

    if (result) {
      return NextResponse.json({ success: true, video: result })
    }

    return NextResponse.json({
      error: 'Could not process this Instagram video. Make sure the account is public.',
    }, { status: 404 })

  } catch (error) {
    console.error('[Instagram Error]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
