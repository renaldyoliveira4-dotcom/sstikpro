import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json()

    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const ipHash = createHash('sha256')
      .update(ip + (process.env.IP_SALT || 'sstikpro-salt'))
      .digest('hex')

    const country = request.headers.get('x-vercel-ip-country') || null
    const userAgent = request.headers.get('user-agent') || null

    await supabase.from('visitors').insert({
      ip_hash: ipHash,
      page: page || '/',
      country,
      user_agent: userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
