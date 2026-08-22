import React from 'react';
import { CardCategory } from '@boshpana/shared';

interface IkatCardBorderProps {
  category: CardCategory;
  color: string;
}

export const IkatCardBorder: React.FC<IkatCardBorderProps> = ({ category, color }) => {
  // Category specific Ikat palettes inspired by traditional Khan-Atlas & Adras
  const getIkatColors = () => {
    switch (category) {
      case 'profession': // Gold / Yellow / Black Ikat (Poster 4 & 9)
        return { c1: '#f59e0b', c2: '#fbbf24', c3: '#78350f', bg: '#1c1917' };
      case 'biology': // Cobalt / Azure Blue Flame Ikat (Poster 5)
        return { c1: '#0284c7', c2: '#38bdf8', c3: '#0369a1', bg: '#0c2135' };
      case 'health': // Emerald Green / Gold Ikat
        return { c1: '#10b981', c2: '#34d399', c3: '#065f46', bg: '#06281e' };
      case 'baggage': // Fiery Orange / Red Diamond Ikat (Poster 7)
        return { c1: '#ea580c', c2: '#f97316', c3: '#9a3412', bg: '#2b1308' };
      case 'hobby': // Violet / Magenta Chevron Ikat (Poster 2)
        return { c1: '#a855f7', c2: '#ec4899', c3: '#6b21a8', bg: '#230b38' };
      case 'fact': // Saffron Yellow / Sky Blue Ikat (Poster 3)
        return { c1: '#eab308', c2: '#0284c7', c3: '#854d0e', bg: '#231c0a' };
      case 'special': // Multi-color Rainbow Khan-Atlas (Poster 1 & 8)
      default:
        return { c1: '#ef4444', c2: '#eab308', c3: '#3b82f6', bg: '#260a0a' };
    }
  };

  const { c1, c2, c3 } = getIkatColors();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
      {/* ================= SVG AUTHENTIC IKAT / ADRAS BORDER FRAME ================= */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 260 380" 
        preserveAspectRatio="none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ikat Diamond Pattern */}
          <pattern id={`ikat-pattern-${category}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 10,0 L 20,10 L 10,20 L 0,10 Z" fill={c1} fillOpacity="0.25" />
            <path d="M 10,4 L 16,10 L 10,16 L 4,10 Z" fill={c2} fillOpacity="0.4" />
            <circle cx="10" cy="10" r="2" fill={c3} />
          </pattern>
        </defs>

        {/* Outer Solid Distress Border */}
        <rect x="3" y="3" width="254" height="374" rx="14" stroke={c1} strokeWidth="2.5" strokeOpacity="0.9" />
        
        {/* Inner Ikat Pattern Trim Border */}
        <rect x="7" y="7" width="246" height="366" rx="11" stroke={`url(#ikat-pattern-${category})`} strokeWidth="5" strokeOpacity="0.8" />
        <rect x="12" y="12" width="236" height="356" rx="9" stroke={c1} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" />

        {/* Top-Left Ikat Chevron Corner */}
        <g fill={c1}>
          <polygon points="12,12 28,12 12,28" opacity="0.8" />
          <polygon points="15,15 24,15 15,24" fill={c2} />
          <line x1="12" y1="36" x2="36" y2="12" stroke={c3} strokeWidth="1.5" />
        </g>

        {/* Top-Right Ikat Chevron Corner */}
        <g fill={c1} transform="translate(260, 0) scale(-1, 1)">
          <polygon points="12,12 28,12 12,28" opacity="0.8" />
          <polygon points="15,15 24,15 15,24" fill={c2} />
          <line x1="12" y1="36" x2="36" y2="12" stroke={c3} strokeWidth="1.5" />
        </g>

        {/* Bottom-Left Ikat Chevron Corner */}
        <g fill={c1} transform="translate(0, 380) scale(1, -1)">
          <polygon points="12,12 28,12 12,28" opacity="0.8" />
          <polygon points="15,15 24,15 15,24" fill={c2} />
          <line x1="12" y1="36" x2="36" y2="12" stroke={c3} strokeWidth="1.5" />
        </g>

        {/* Bottom-Right Ikat Chevron Corner */}
        <g fill={c1} transform="translate(260, 380) scale(-1, -1)">
          <polygon points="12,12 28,12 12,28" opacity="0.8" />
          <polygon points="15,15 24,15 15,24" fill={c2} />
          <line x1="12" y1="36" x2="36" y2="12" stroke={c3} strokeWidth="1.5" />
        </g>

        {/* Top Ikat Diamond Crest */}
        <g transform="translate(130, 8)">
          <polygon points="0,-4 8,4 0,12 -8,4" fill={c1} />
          <polygon points="0,0 4,4 0,8 -4,4" fill={c2} />
        </g>

        {/* Bottom Ikat Diamond Crest */}
        <g transform="translate(130, 372)">
          <polygon points="0,4 8,-4 0,-12 -8,-4" fill={c1} />
          <polygon points="0,0 4,-4 0,-8 -4,-4" fill={c2} />
        </g>
      </svg>
    </div>
  );
};
