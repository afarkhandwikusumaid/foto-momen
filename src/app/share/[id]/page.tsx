import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import SharePageClient from './SharePageClient';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetch photo session dari server untuk generate metadata SEO.
 * Fungsi ini berjalan di SERVER sehingga meta tags tersedia saat bot crawl.
 */
async function fetchSession(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('photo_sessions')
      .select('*')
      .or(`id.eq.${id},session_id.eq.${id}`)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * generateMetadata — dijalankan di server untuk membuat meta tags dinamis.
 * Ketika link di-share ke WhatsApp/Instagram/Twitter, bot akan mendapatkan:
 * - OG Image: foto asli dari sesi tersebut
 * - OG Title: "Lihat Foto dari [nama]!"
 * - Preview thumbnail langsung muncul
 */
export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await fetchSession(id);

  const imageUrl = session?.image_url || '/og-image.png';
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://foto-momen.vercel.app';

  return {
    title: 'Lihat Foto Momenku! 📸',
    description:
      'Seseorang membagikan foto strip digitalnya dari Foto Momen. Lihat dan buat fotomu sendiri!',
    openGraph: {
      title: 'Lihat Foto Momenku! 📸',
      description:
        'Seseorang membagikan foto strip digitalnya. Klik untuk lihat dan buat fotomu sendiri di Foto Momen!',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1200,
          alt: 'Foto Momen — Foto Strip Digital',
        },
      ],
      url: `${baseUrl}/share/${id}`,
      type: 'website',
      siteName: 'Foto Momen',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lihat Foto Momenku! 📸',
      description: 'Seseorang membagikan foto strip digitalnya dari Foto Momen!',
      images: [imageUrl],
    },
  };
}

/**
 * Server Component untuk halaman /share/[id].
 * generateMetadata() berjalan di server → bot mendapat HTML penuh.
 * SharePageClient berjalan di client → user mendapat UI interaktif.
 */
export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const session = await fetchSession(id);

  return <SharePageClient id={id} initialSession={session} />;
}
