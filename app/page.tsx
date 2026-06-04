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
  alternates: { canonical: 'https://sstikpro.com' },
}

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SSTikPro',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free TikTok video downloader without watermark. Download HD quality TikTok videos instantly.',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '12547' },
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
