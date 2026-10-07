import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header
      className="relative w-full pt-10 pb-16 px-4 text-center overflow-hidden shadow-md"
      style={{
        background: 'linear-gradient(135deg, #5B3FD6 0%, #8B6FE8 50%, #E76F8A 100%)',
      }}
    >
      {/* Subtle decorative glowing shapes for modern gradient depth */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#F5A889]/25 blur-2xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded-full text-xs font-bold tracking-wide uppercase bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F5A889]" />
          <span>Powered by AI</span>
        </div>

        {/* Main Title: Large WHITE text */}
        <div className="flex items-center gap-3 justify-center mb-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-[#5B3FD6] bg-white shadow-lg">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            CreateFlow AI
          </h1>
        </div>

        {/* Subtitle in light white text */}
        <p className="text-base sm:text-lg md:text-xl font-medium text-white/95 max-w-xl mx-auto leading-relaxed">
          &ldquo;Create text, images and code with the power of AI.&rdquo;
        </p>
      </div>
    </header>
  );
};

