import Link from 'next/link'
import { Download, Globe, Play, Share2 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#1E293B' }} className="text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F6D7A, #89A5B1)' }}>
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SS<span style={{ color: '#89A5B1' }}>Tik</span>Pro
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The fastest and most reliable video downloader. Free, no watermark, HD quality.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://t.me/+CItjrX7UUoIwNjZh" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="Telegram">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="Twitter/X">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="YouTube">
                <Play className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">TikTok Downloader</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram Downloader</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">YouTube Downloader</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {currentYear} SSTikPro. All rights reserved.</p>
          <p>Not affiliated with TikTok, Instagram or YouTube.</p>
        </div>
      </div>
    </footer>
  )
}
