import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://foto-momen.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Kita cegah Google meng-index halaman admin dan halaman share spesifik jika itu privat
      disallow: ['/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
