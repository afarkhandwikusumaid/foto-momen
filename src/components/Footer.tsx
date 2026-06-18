/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white py-8 transition-all duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="font-display text-sm font-semibold text-slate-800 flex items-center gap-1.5 justify-center sm:justify-start">
              Foto Momen Premium
              <Sparkles className="h-3 w-3 text-blue-500 fill-blue-500/20" />
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Abadikan momen berhargamu langsung melalui peramban web dengan cepat dan aman ke Firebase Cloud.
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="text-slate-500">Dibuat dengan</span>
            <Heart className="h-3 w-3 text-blue-600 fill-blue-500" />
            <span className="text-slate-500">untuk memori yang abadi • </span>
            <span className="text-slate-400">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
