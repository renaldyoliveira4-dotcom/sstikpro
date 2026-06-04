import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SSTikPro',
  description: 'SSTikPro Privacy Policy. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://sstikpro.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="py-12" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/70 text-sm">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border shadow-sm p-8 md:p-10 prose-custom" style={{ borderColor: '#E2E8F0' }}>
          <h2>1. Information We Collect</h2>
          <p>SSTikPro is committed to protecting your privacy. When you use our service, we may collect the following types of information:</p>
          <ul>
            <li><strong>Usage Data:</strong> Information about how you use our service, including pages visited, time spent on pages, and download actions.</li>
            <li><strong>Technical Data:</strong> IP address (hashed for anonymization), browser type, device type, and operating system.</li>
            <li><strong>URLs Submitted:</strong> TikTok video URLs you paste into our downloader. These are processed to fetch the video and are not permanently stored.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and improve our video downloading service</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Prevent abuse and ensure service stability</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Cookies and Tracking</h2>
          <p>SSTikPro uses cookies and similar tracking technologies to improve your experience. We use:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li><strong>Analytics Cookies:</strong> Google Analytics to understand site usage (anonymized)</li>
            <li><strong>Advertising Cookies:</strong> For displaying relevant advertisements</li>
          </ul>
          <p>You can opt out of analytics tracking by using browser privacy settings or ad blocker extensions.</p>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal data. We may share anonymized, aggregated data with:</p>
          <ul>
            <li>Analytics providers (Google Analytics)</li>
            <li>Advertising networks (for ad display)</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>We retain analytics data for up to 26 months. Hashed IP addresses are stored for security purposes for up to 90 days. Video URLs submitted for processing are not stored after processing is complete.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to deletion of your data</li>
            <li>Right to opt out of data collection</li>
            <li>Right to data portability</li>
          </ul>
          <p>To exercise these rights, contact us at privacy@sstikpro.com.</p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>SSTikPro is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>

          <h2>8. Third-Party Services</h2>
          <p>Our service integrates with Google Analytics and advertising networks. These services have their own privacy policies which we encourage you to review.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.</p>

          <h2>10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@sstikpro.com or through our <a href="/contact" style={{ color: '#4F6D7A' }}>Contact page</a>.</p>
        </div>
      </div>
    </div>
  )
}
