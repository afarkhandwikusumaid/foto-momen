/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, Sparkles, RefreshCw } from 'lucide-react';
import { ActivePhase } from '../types';

interface NavbarProps {
  currentPhase: ActivePhase;
  onReset: () => void;
}

export default function Navbar({ currentPhase, onReset }: NavbarProps) {
  return (
    <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={onReset}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 animate-glow-pulse flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Camera className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-slate-800 flex items-center gap-1">
                Foto Momen
                <Sparkles className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-blue-500 font-mono">
                Blue Edition
              </span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-4">
            {/* Firebase Cloud Status Badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-650">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse inline-block mr-1.5" />
              Firebase Cloud
            </div>

            {/* Back to Home Button if not in home phase */}
            {currentPhase !== 'landing' && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-slow text-blue-600" />
                <span>Mulai Ulang</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
