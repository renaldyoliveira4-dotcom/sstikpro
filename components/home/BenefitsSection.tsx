import { Droplets, Tv, Zap, Infinity, Smartphone, Heart } from 'lucide-react'

const benefits = [
  {
    icon: Droplets,
    title: 'No Watermark',
    description: 'Download clean TikTok videos without any watermark or logo overlay for a professional look.',
    color: '#4F6D7A',
  },
  {
    icon: Tv,
    title: 'HD Quality',
    description: 'Get the original high-definition video quality preserved, exactly as uploaded by the creator.',
    color: '#6B8793',
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Our optimized servers process and deliver your video download in just a few seconds.',
    color: '#89A5B1',
  },
  {
    icon: Infinity,
    title: 'Unlimited Downloads',
    description: 'No daily limits or restrictions. Download as many TikTok videos as you need, anytime.',
    color: '#4F6D7A',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works perfectly on iPhone, Android, and all mobile browsers. No app installation needed.',
    color: '#6B8793',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description: 'SSTikPro is and will always be completely free. No hidden fees, no subscriptions.',
    color: '#89A5B1',
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-16 md:py-20" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#1E293B' }}>
            Why Choose SSTikPro?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Everything you need to download TikTok videos quickly and easily, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow animate-fade-in-up"
                style={{
                  borderColor: '#E2E8F0',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${benefit.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1E293B' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
