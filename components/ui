'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    // Listen for install prompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }

    if (!installPrompt) return

    await installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
  }

  // Don't show if already installed or no prompt available and not iOS
  if (isInstalled) return null
  if (!installPrompt && !isIOS) return null

  return (
    <>
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <Download className="w-4 h-4" />
        📲 Instalar App Grátis
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-extrabold mb-2" style={{ color: '#1E293B' }}>
              Instalar SSTikPro no iPhone
            </h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>
              Siga os passos abaixo para adicionar o app na sua tela inicial:
            </p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Toque no botão de compartilhar', icon: '⬆️' },
                { step: '2', text: 'Role para baixo e toque em "Adicionar à Tela de Início"', icon: '➕' },
                { step: '3', text: 'Toque em "Adicionar" no canto superior direito', icon: '✅' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm" style={{ color: '#1E293B' }}>{item.text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)' }}
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
