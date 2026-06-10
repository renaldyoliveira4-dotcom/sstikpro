import type { Metadata, Viewport } from 'next'

import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTracker from '@/components/ui/PageTracker'
import Script from 'next/script'



const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const metadata: Metadata = {
  metadataBase: new URL('https://sstikpro.com.br'),
  title: {
    default: 'SSTikPro - Download TikTok Videos Without Watermark | Free HD Downloader',
    template: '%s | SSTikPro',
  },
  description: 'Download TikTok videos without watermark for free. Fast, HD quality, no registration required. Works on iPhone, Android, and Desktop.',
  keywords: ['tiktok downloader', 'download tiktok without watermark', 'tiktok video download', 'tiktok hd download', 'save tiktok video'],
  authors: [{ name: 'SSTikPro' }],
  creator: 'SSTikPro',
  publisher: 'SSTikPro',
  verification: {
    google: 'EsX0cHkNCmLXjSKG8QluTps2MG4SxhB0U-9ixgftw5Y',
    other: {
      'monetag': '15d8690d3fec42c4e3144f2fc382e02e',
    },
  },
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
    url: 'https://sstikpro.com.br',
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
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{
`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2186186862219304');
fbq('track', 'PageView');`
        }</Script>

        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18214100783"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18214100783');
        `}</Script>


        <PageTracker />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
