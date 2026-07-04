import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1d90ff',
};

export const metadata: Metadata = {
  title: {
    default: 'Foto Momen — Virtual Photobooth Indonesia',
    template: '%s | Foto Momen',
  },
  description:
    'Buat foto strip digital bersama teman di Foto Momen. Pilih template, ambil foto, tambah filter, dan bagikan momenmu!',
  keywords: [
    'photobooth',
    'foto strip',
    'virtual photobooth',
    'foto digital',
    'foto bersama',
    'foto momen',
    'booth foto online',
    'Indonesia',
  ],
  authors: [{ name: 'Foto Momen' }],
  creator: 'Foto Momen',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://foto-momen.vercel.app'
  ),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Foto Momen',
    title: 'Foto Momen — Virtual Photobooth Indonesia',
    description:
      'Buat foto strip digital bersama teman. Pilih template, ambil foto, tambah filter, dan bagikan momenmu!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Foto Momen — Virtual Photobooth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foto Momen — Virtual Photobooth Indonesia',
    description: 'Buat foto strip digital bersama teman di Foto Momen!',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon/fm-icon.png',
    shortcut: '/favicon/fm-icon.png',
    apple: '/favicon/fm-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Foto Momen',
              description: 'Virtual Photobooth Indonesia - Buat foto strip digital bersama teman!',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'https://foto-momen.vercel.app',
              applicationCategory: 'Photography, Entertainment',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'IDR'
              }
            }),
          }}
        />
      </head>
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
