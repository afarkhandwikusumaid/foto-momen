import React from 'react';
import Image from 'next/image';
import { Instagram, Mail } from 'lucide-react';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center">
        {/* Social Links */}
        <div className="flex items-center gap-8 mb-10">
          <a
            href="#"
            className="text-slate-400 transition-colors hover:text-pink-600"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#"
            className="text-slate-400 transition-colors hover:text-black"
            aria-label="TikTok"
          >
            <TiktokIcon className="w-6 h-6" />
          </a>
          <a
            href="mailto:halo@fotomomen.com"
            className="text-slate-400 transition-colors hover:text-blue-600"
            aria-label="Email"
          >
            <Mail size={24} />
          </a>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/fm-logo-text.png"
            alt="Foto Momen Logo"
            width={180}
            height={60}
            className="h-auto w-40 object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>

        {/* Bottom Text */}
        <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-400 font-medium">
          <p>
            &copy; {new Date().getFullYear()} Foto Momen. Layanan Virtual Photobooth Gratis.
          </p>
          <p className="text-[10px] text-slate-300">
            Dibuat dengan dedikasi untuk kenangan yang abadi.
          </p>
        </div>
      </div>
    </footer>
  );
}
