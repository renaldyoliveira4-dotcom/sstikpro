import { Copy, ClipboardPaste, Download } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Copy,
    title: 'Copy TikTok Link',
    description: 'Open TikTok, find the video you want, tap the Share button, and copy the video link.',
  },
  {
    step: 2,
    icon: ClipboardPaste,
    title: 'Paste Into SSTikPro',
    description: 'Paste the copied TikTok URL into the input field at the top of this page.',
  },
  {
    step: 3,
    icon: Download,
    title: 'Download Without Watermark',
    description: 'Click the Download button and save your HD quality, watermark-free video instantly.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#1E293B' }}>
            How It Works
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Download any TikTok video in just 3 simple steps. No registration, no software installation needed.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-2/3 h-0.5" style={{ background: 'linear-gradient(90deg, #4F6D7A, #6B8793, #89A5B1)' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                    style={{ background: 'linear-gradient(135deg, #4F6D7A, #89A5B1)' }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                      style={{ background: '#1E293B' }}
                    >
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#1E293B' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#64748B' }}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
