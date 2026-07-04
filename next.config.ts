import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Izinkan gambar dari domain Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
};

export default nextConfig;
