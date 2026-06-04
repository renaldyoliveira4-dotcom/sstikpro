import type { Metadata } from 'next'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - SSTikPro Support',
  description: 'Contact SSTikPro support team. We\'re here to help with any questions about downloading TikTok videos.',
  alternates: { canonical: 'https://sstikpro.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Hero */}
      <div className="py-12 md:py-16" style={{ background: 'linear-gradient(135deg, #4F6D7A 0%, #89A5B1 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-white/80 text-lg">Have a question? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: 'Email',
                text: 'support@sstikpro.com',
                desc: 'We reply within 24 hours',
              },
              {
                icon: MessageSquare,
                title: 'Support',
                text: 'Help Center',
                desc: 'Browse our FAQ for quick answers',
              },
              {
                icon: Clock,
                title: 'Response Time',
                text: '< 24 Hours',
                desc: 'Monday to Friday',
              },
            ].map((info) => {
              const Icon = info.icon
              return (
                <div
                  key={info.title}
                  className="bg-white rounded-2xl p-5 border shadow-sm"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: '#4F6D7A15' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#4F6D7A' }} />
                  </div>
                  <h3 className="font-bold text-sm mb-0.5" style={{ color: '#1E293B' }}>{info.title}</h3>
                  <p className="text-sm font-semibold" style={{ color: '#4F6D7A' }}>{info.text}</p>
                  <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{info.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-xl font-extrabold mb-6" style={{ color: '#1E293B' }}>
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
