import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

const PIXEL_ID = '2186186862219304'

interface MetaEvent {
  event_name: string
  event_time: number
  action_source: string
  event_source_url: string
  user_data: {
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string
    fbp?: string
  }
  custom_data?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request)
    if (!checkRateLimit(ip, 30, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { event_name, event_source_url, custom_data, fbc, fbp } = await request.json()

    if (!event_name) {
      return NextResponse.json({ error: 'event_name required' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    const token = process.env.META_ACCESS_TOKEN || 'EAAR8h06tajsBRgbfcGPiP7F5V99dT6ZBw97TP4jQ0R4BE20Ocx9L8uV7CoPfus9JZB3V36IS1l3RpAgJ8HwsgZCbLm8jrBfkvhswBG3zsoEMKABKYvvNy4KN2VKzhpSHWzqJImitgECfUPt5JXhjYq5biVByZCWBFaRoYnikAKOuRv1uFaZBGCSbLak4ftfuG0wZDZD'



    const event: MetaEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: event_source_url || 'https://sstikpro.com.br',
      user_data: {
        client_ip_address: ip !== 'unknown' ? ip : undefined,
        client_user_agent: userAgent,
        fbc: fbc || undefined,
        fbp: fbp || undefined,
      },
      custom_data: custom_data || undefined,
    }

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event], test_event_code: 'TEST1762' }),
      }
    )

    const result = await response.json()
    console.log('[Meta CAPI]', event_name, result)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('[Meta CAPI Error]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
