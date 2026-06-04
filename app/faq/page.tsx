import type { Metadata } from 'next'
import FAQSection from '@/components/home/FAQSection'
import { faqs } from '@/lib/faq-data'
import AdBanner from '@/components/ads/AdBanner'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions About SSTikPro',
  description: 'Find answers to frequently asked questions about SSTikPro TikTok video downloader. Learn how to download videos, about quality, privacy, and more.',
  alternates: { canonical: 'https://sstikpro.com/faq' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
        {/* Hero */}
        <div className="py-12 md:py-16" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/80 text-lg">
              Everything you need to know about SSTikPro and downloading TikTok videos.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdBanner placement="FAQ Top Banner" size="sm" className="mb-8" />
        </div>

        <FAQSection showAll={true} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <AdBanner placement="FAQ Bottom Banner" size="md" className="mb-8" />

          {/* CTA */}
          <div className="text-center bg-white rounded-2xl p-8 border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>
              Still have questions?
            </h2>
            <p className="mb-6" style={{ color: '#64748B' }}>
              Our support team is ready to help you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)' }}
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
