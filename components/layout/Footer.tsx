import Link from 'next/link'
import { Download, Globe, Play, Share2 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#1E293B' }} className="text-slate-300">
      {/* Ad Banner Footer */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="ad-placeholder rounded-lg h-16 md:h-20" style={{ background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
            AD — Footer Banner (728×90 Desktop / 320×50 Mobile)
          </div>
        </div>
      </div>

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
              The fastest and most reliable TikTok video downloader. Free, no watermark, HD quality.
            </p>
            <div className="flex gap-3 mt-4">
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
              <li><span className="text-slate-500 cursor-not-allowed">Instagram Downloader (soon)</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">YouTube Shorts (soon)</span></li>
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
          <p>Not affiliated with TikTok or ByteDance Ltd.</p>
        </div>
      </div>
    </footer>
  )
}
