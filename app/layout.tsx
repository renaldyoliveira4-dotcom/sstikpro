import type { Metadata, Viewport } from 'next'

import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Script from 'next/script'



const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const metadata: Metadata = {
  metadataBase: new URL('https://sstikpro.com'),
  title: {
    default: 'SSTikPro - Download TikTok Videos Without Watermark | Free HD Downloader',
    template: '%s | SSTikPro',
  },
  description: 'Download TikTok videos without watermark for free. Fast, HD quality, no registration required. Works on iPhone, Android, and Desktop.',
  keywords: ['tiktok downloader', 'download tiktok without watermark', 'tiktok video download', 'tiktok hd download', 'save tiktok video'],
  authors: [{ name: 'SSTikPro' }],
  creator: 'SSTikPro',
  publisher: 'SSTikPro',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sstikpro.com',
    siteName: 'SSTikPro',
    title: 'SSTikPro - Download TikTok Videos Without Watermark',
    description: 'Fast, free TikTok video downloader. Download HD quality videos without watermark. No registration required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SSTikPro - TikTok Video Downloader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSTikPro - Download TikTok Videos Without Watermark',
    description: 'Fast, free TikTok video downloader. HD quality, no watermark, no registration.',
    images: ['/og-image.png'],
    creator: '@sstikpro',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4F6D7A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className={"min-h-screen flex flex-col"} style={{ background: '#F8FAFC' }}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}</Script>
          </>
        )}
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
