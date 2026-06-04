'use client'

import { useState } from 'react'
import { Download, Link as LinkIcon, CheckCircle, Loader2, ShieldCheck, Zap, Star } from 'lucide-react'

export default function HeroSection() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidTikTokUrl = (value: string) => {
    return value.includes('tiktok.com') || value.includes('vm.tiktok') || value.includes('vt.tiktok')
  }

  const handleDownload = () => {
    if (!url.trim()) {
      setErrorMsg('Please paste a TikTok URL first.')
      setStatus('error')
      return
    }
    if (!isValidTikTokUrl(url)) {
      setErrorMsg('Please enter a valid TikTok link.')
      setStatus('error')
      return
    }
    setErrorMsg('')
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
    }, 2000)
  }

  const handleReset = () => {
    setUrl('')
    setStatus('idle')
    setErrorMsg('')
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #6B8793 60%, #89A5B1 100%)' }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
          radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span>Free · No Registration · HD Quality</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          Download TikTok Videos<br className="hidden md:block" />
          <span className="text-yellow-300"> Without Watermark</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Fast, Free and High Quality Video Downloader. Save TikTok videos in HD quality with no watermark in seconds.
        </p>

        {/* Download Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-2xl mx-auto">
          {status === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#22C55E' }} />
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1E293B' }}>Video Detected!</h3>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                Video processing feature coming soon. We&apos;ll notify you when it&apos;s ready!
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)' }}
              >
                Download Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setStatus('idle'); setErrorMsg('') }}
                  placeholder="Paste TikTok link here..."
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
                style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)', minWidth: '140px' }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    DOWNLOAD
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <p className="mt-2 text-sm text-red-500 text-left">{errorMsg}</p>
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
