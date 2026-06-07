import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: 'Instagram download coming soon! We are working hard to bring this feature. For now, enjoy our TikTok downloader! 📸',
    comingSoon: true,
  }, { status: 503 })
}
