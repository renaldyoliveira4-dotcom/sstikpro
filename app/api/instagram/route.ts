import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: '📸 Instagram download coming soon! Use TikTok downloader for now.',
    comingSoon: true,
  }, { status: 503 })
}
