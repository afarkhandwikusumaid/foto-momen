import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://foto-momen.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Anda bisa menambahkan halaman dinamis di masa depan jika ada
    // Contoh: blog posts, atau halaman publik lainnya
  ];
}
