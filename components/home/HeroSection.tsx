'use client'

import { useState } from 'react'
import { Download, Link as LinkIcon, CheckCircle, Loader2, ShieldCheck, Zap, Star, Music, User, AlertCircle } from 'lucide-react'
import PWAInstallButton from '@/components/ui/PWAInstallButton'

type VideoResult = {
  title: string
  cover: string | null
  author: { name: string; avatar: string | null }
  hdPlay: string | null
  play: string | null
  music: string | null
  duration: number
}

type Platform = 'tiktok' | 'instagram' | 'youtube'

export default function HeroSection() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [video, setVideo] = useState<VideoResult | null>(null)
  const [platform, setPlatform] = useState<Platform>('tiktok')

  const isValidUrl = (value: string) => {
    if (platform === 'tiktok') {
      return value.includes('tiktok.com') || value.includes('vm.tiktok') || value.includes('vt.tiktok')
    }
    if (platform === 'instagram') {
      return value.includes('instagram.com') || value.includes('instagr.am')
    }
    return value.includes('youtube.com') || value.includes('youtu.be')
  }

  const handleDownload = async () => {
    if (!url.trim()) {
      setErrorMsg(`Please paste a ${platform === 'tiktok' ? 'TikTok' : 'YouTube'} URL first.`)
      setStatus('error')
      return
    }
    if (!isValidUrl(url)) {
      setErrorMsg(`Please enter a valid ${platform === 'tiktok' ? 'TikTok' : 'YouTube'} link.`)
      setStatus('error')
      return
    }

    setErrorMsg('')
    setStatus('loading')
    setVideo(null)

    try {
      const endpoint = platform === 'tiktok' ? '/api/download' : platform === 'instagram' ? '/api/instagram' : '/api/youtube'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (data.comingSoon) {
        if (platform === 'instagram') {
          setErrorMsg('📸 Instagram download coming soon! Use TikTok downloader for now.')
        } else {
          setErrorMsg('🚀 YouTube download coming soon! Use TikTok downloader for now.')
        }
        setStatus('error')
        return
      }

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to process video. Please try again.')
        setStatus('error')
        return
      }

      setVideo(data.video)
      setStatus('success')
    } catch {
      setErrorMsg('Connection error. Please try again.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setUrl('')
    setStatus('idle')
    setErrorMsg('')
    setVideo(null)
  }

  const placeholder = platform === 'tiktok' 
    ? 'Paste TikTok link here...' 
    : platform === 'instagram' ? 'Paste Instagram link here...'
    : 'Paste YouTube link here...'

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: platform === 'tiktok' 
        ? 'linear-gradient(135deg, #4F6D7A 0%, #6B8793 60%, #89A5B1 100%)'
        : platform === 'instagram' ? 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)'
        : 'linear-gradient(135deg, #C00 0%, #8B0000 60%, #CC0000 100%)' 
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
          radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span>Free · No Registration · HD Quality</span>
        </div>

        {/* PWA Install Button */}
        <div className="mb-6 flex justify-center">
          <PWAInstallButton />
        </div>

        {/* Platform Tabs */}
        <div className="inline-flex rounded-2xl p-1 mb-8 gap-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <button
            onClick={() => { setPlatform('tiktok'); handleReset() }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: platform === 'tiktok' ? 'white' : 'transparent',
              color: platform === 'tiktok' ? '#4F6D7A' : 'rgba(255,255,255,0.8)',
            }}
          >
            🎵 TikTok
          </button>
          <button
            onClick={() => { setPlatform('instagram'); handleReset() }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: platform === 'instagram' ? 'white' : 'transparent',
              color: platform === 'instagram' ? '#E1306C' : 'rgba(255,255,255,0.8)',
            }}
          >
            📸 Instagram
          </button>
          <button
            onClick={() => { setPlatform('youtube'); handleReset() }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: platform === 'youtube' ? 'white' : 'transparent',
              color: platform === 'youtube' ? '#C00' : 'rgba(255,255,255,0.8)',
            }}
          >
            ▶️ YouTube
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          {platform === 'tiktok' ? (
            <>Download TikTok Videos<br className="hidden md:block" />
            <span className="text-yellow-300"> Without Watermark</span></>
          ) : platform === 'instagram' ? (
            <>Download Instagram Reels<br className="hidden md:block" />
            <span className="text-yellow-300"> Without Watermark</span></>
          ) : (
            <>Download YouTube Videos<br className="hidden md:block" />
            <span className="text-yellow-300"> In HD Quality</span></>
          )}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {platform === 'tiktok'
            ? 'Fast, Free and High Quality Video Downloader. Save TikTok videos in HD quality with no watermark in seconds.'
            : platform === 'instagram'
            ? 'Download Instagram Reels and videos for free. Save in HD quality without watermark in seconds.'
            : 'Fast, Free YouTube Video Downloader. Save YouTube videos in HD quality directly to your device.'
          }
        </p>

        {/* Download Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setStatus('idle'); setErrorMsg(''); setVideo(null) }}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-colors"
                style={{
                  borderColor: status === 'error' ? '#EF4444' : '#E2E8F0',
                  color: '#1E293B',
                  background: '#F8FAFC'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              />
            </div>
            <button
              onClick={handleDownload}
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 whitespace-nowrap"
              style={{ 
                background: platform === 'tiktok' 
                  ? 'linear-gradient(135deg, #4F6D7A, #6B8793)' 
                  : 'linear-gradient(135deg, #CC0000, #8B0000)',
                minWidth: '140px' 
              }}
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                <><Download className="w-4 h-4" />DOWNLOAD</>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {status === 'success' && video && (
            <div className="mt-5 border rounded-xl overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3 p-4" style={{ background: '#F8FAFC' }}>
                {video.cover && (
                  <img src={video.cover} alt={video.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>
                    {video.title || 'Video'}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#64748B' }}>
                    <User className="w-3 h-3" />
                    {video.author.name}
                    {video.duration > 0 && <span className="ml-2">· {video.duration}s</span>}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#22C55E' }} />
              </div>

              <div className="p-4 flex flex-col sm:flex-row gap-2">
                {video.hdPlay && (
                  <a
                    href={`/api/proxy?url=${encodeURIComponent(video.hdPlay)}&filename=sstikpro-hd.mp4&type=video`}
                    download="sstikpro-hd.mp4"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: platform === 'tiktok' ? 'linear-gradient(135deg, #4F6D7A, #6B8793)' : platform === 'instagram' ? 'linear-gradient(135deg, #833AB4, #E1306C)' : 'linear-gradient(135deg, #CC0000, #8B0000)' }}
                  >
                    <Download className="w-4 h-4" />
                    Download HD
                  </a>
                )}
                {video.play && video.play !== video.hdPlay && (
                  <a
                    href={`/api/proxy?url=${encodeURIComponent(video.play)}&filename=sstikpro-sd.mp4&type=video`}
                    download="sstikpro-sd.mp4"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 border"
                    style={{ color: '#4F6D7A', borderColor: '#4F6D7A' }}
                  >
                    <Download className="w-4 h-4" />
                    Download SD
                  </a>
                )}
                {video.music && (
                  <a
                    href={`/api/proxy?url=${encodeURIComponent(video.music)}&filename=sstikpro-music.mp3&type=audio`}
                    download="sstikpro-music.mp3"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 border"
                    style={{ color: '#64748B', borderColor: '#E2E8F0' }}
                  >
                    <Music className="w-4 h-4" />
                    MP3
                  </a>
                )}
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={handleReset}
                  className="w-full py-2 text-xs font-medium transition-colors hover:underline"
                  style={{ color: '#94A3B8' }}
                >
                  ↩ Download another video
                </button>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: '#94A3B8' }}>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                Safe &amp; Secure
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                Instant Download
              </span>
              <span>·</span>
              <span>No Registration Required</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 text-white/90">
          {[
            { value: '10M+', label: 'Videos Downloaded' },
            { value: '4.9★', label: 'User Rating' },
            { value: '100%', label: 'Free Forever' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
