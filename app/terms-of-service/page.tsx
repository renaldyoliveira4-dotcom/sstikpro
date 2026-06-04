import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SSTikPro',
  description: 'SSTikPro Terms of Service. Read our terms before using the TikTok video downloader service.',
  alternates: { canonical: 'https://sstikpro.com/terms-of-service' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="py-12" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Terms of Service</h1>
          <p className="text-white/70 text-sm">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border shadow-sm p-8 md:p-10 prose-custom" style={{ borderColor: '#E2E8F0' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using SSTikPro (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>

          <h2>2. Description of Service</h2>
          <p>SSTikPro provides a web-based tool that allows users to download videos from TikTok and other social media platforms. The service is provided free of charge and is supported by advertising revenue.</p>

          <h2>3. Acceptable Use</h2>
          <p>You agree to use SSTikPro only for lawful purposes. You must not:</p>
          <ul>
            <li>Download or distribute copyrighted content without permission from the rights holder</li>
            <li>Use downloaded content for commercial purposes without proper licensing</li>
            <li>Attempt to circumvent any security measures of the service</li>
            <li>Use the service to harass, abuse, or harm other individuals</li>
            <li>Attempt to overwhelm our servers with excessive requests</li>
            <li>Use automated scripts or bots to access the service</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>Users are solely responsible for ensuring they have the right to download and use any content they obtain through SSTikPro. We respect intellectual property rights and expect our users to do the same.</p>
          <p>The SSTikPro brand, logo, and service are protected by copyright and trademark law. You may not use our intellectual property without express written permission.</p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>SSTikPro is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that:</p>
          <ul>
            <li>The service will be uninterrupted or error-free</li>
            <li>All videos can be downloaded (some may be restricted by creators)</li>
            <li>Video quality will meet specific requirements</li>
            <li>The service will be available at all times</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>SSTikPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>

          <h2>7. Third-Party Content</h2>
          <p>SSTikPro does not host, store, or own any video content. We provide tools to help users access publicly available content. We are not responsible for the content of videos downloaded through our service.</p>

          <h2>8. Relationship with TikTok</h2>
          <p>SSTikPro is not affiliated with, endorsed by, or in any way officially connected to TikTok, ByteDance, or any of its subsidiaries. All product names, logos, and brands are property of their respective owners.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.</p>

          <h2>11. Contact</h2>
          <p>For questions about these Terms, contact us at legal@sstikpro.com or through our <a href="/contact" style={{ color: '#4F6D7A' }}>Contact page</a>.</p>
        </div>
      </div>
    </div>
  )
}
