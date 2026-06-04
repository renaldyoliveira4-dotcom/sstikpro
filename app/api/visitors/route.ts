import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page } = body

    // Hash IP for privacy
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const ipHash = createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex')

    // In production, insert into Supabase
    // const { error } = await supabase.from('visitors').insert({ ip_hash: ipHash, page })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 })
  }
}
