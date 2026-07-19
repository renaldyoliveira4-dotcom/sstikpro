import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import BenefitsSection from '@/components/home/BenefitsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FAQSection from '@/components/home/FAQSection'
import AdBanner from '@/components/ads/AdBanner'
import { faqs } from '@/lib/faq-data'

export const metadata: Metadata = {
  title: 'SSTikPro - Download TikTok Videos Without Watermark | Free HD Downloader',
  description: 'Download TikTok videos without watermark for free. Fast, HD quality, no registration required. Works on iPhone, Android, and Desktop.',
  alternates: { canonical: 'https://sstikpro.com.br' },
}

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SSTikPro',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free TikTok video downloader without watermark. Download HD quality TikTok videos instantly.',
  // aggregateRating removed - will add back with real data
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.slice(0, 6).map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero */}
      <HeroSection />

      {/* Ad below hero */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner placement="Below Hero — 728×90 Desktop / 320×50 Mobile" size="sm" />
      </div>

      {/* Benefits */}
      <BenefitsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Ad mid-page */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner placement="Mid Page Banner — 728×90" size="md" />
      </div>

      {/* FAQ */}
      <FAQSection />

      {/* Telegram CTA */}
      <section className="py-10" style={{ background: '#F8FAFC' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#229ED9' }}>
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base" style={{ color: '#1E293B' }}>Entre no nosso grupo do Telegram!</h3>
                <p className="text-sm" style={{ color: '#64748B' }}>Dicas, novidades e suporte em primeira mão</p>
              </div>
            </div>
            <a
              href="https://t.me/+CItjrX7UUoIwNjZh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: '#229ED9' }}
            >
              📱 Entrar no Grupo
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Download?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join millions of users who download TikTok videos with SSTikPro every day.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl text-base font-bold transition-opacity hover:opacity-90"
            style={{ color: '#4F6D7A' }}
          >
            Start Downloading Free →
          </a>
        </div>
      </section>
    </>
  )
}
