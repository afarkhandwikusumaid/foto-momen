import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8 text-center text-[10px] sm:text-xs text-slate-400 font-bold">
      <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 select-none">
        <span>Foto Momen &copy; {new Date().getFullYear()} • Layanan Virtual Photobooth Gratis.</span>
        <span>Dibuat dengan dedikasi untuk kenangan yang abadi.</span>
      </div>
    </footer>
  );
}
