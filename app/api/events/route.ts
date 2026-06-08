import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getIP } from '@/lib/rateLimit'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request)
    if (!checkRateLimit(ip, 60, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { event_name, platform, quality, error_message, page } = await request.json()

    if (!event_name) {
      return NextResponse.json({ error: 'event_name required' }, { status: 400 })
    }

    const ipHash = createHash('sha256')
      .update(ip + (process.env.IP_SALT || 'sstikpro-salt'))
      .digest('hex')

    const country = request.headers.get('x-vercel-ip-country') || null

    await supabase.from('events').insert({
      event_name,
      platform: platform || null,
      quality: quality || null,
      error_message: error_message || null,
      page: page || null,
      country,
      ip_hash: ipHash,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Events API Error]', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
