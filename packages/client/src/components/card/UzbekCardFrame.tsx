import React from 'react';

interface UzbekCardFrameProps {
  color: string;
  glowColor?: string;
}

export const UzbekCardFrame: React.FC<UzbekCardFrameProps> = ({ color }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* ================= SVG VECTOR BORDER (ISLIMIY & GIRIH ILLUMINATION) ================= */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 440" 
        preserveAspectRatio="none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer Fine Double Border */}
        <rect x="5" y="5" width="290" height="430" rx="16" stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
        <rect x="9" y="9" width="282" height="422" rx="13" stroke={color} strokeWidth="2" strokeOpacity="0.85" />
        <rect x="13" y="13" width="274" height="414" rx="10" stroke={color} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />

        {/* ========== TOP-LEFT ISLIMIY CORNER ORNAMENT ========== */}
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main Corner Floral Arch */}
          <path d="M 14,50 C 14,24 24,14 50,14" />
          <path d="M 14,36 C 20,28 28,20 36,14" />
          {/* Corner Palmette / Lotus Bud */}
          <path d="M 22,22 C 28,16 38,18 42,28 C 36,36 28,34 22,22 Z" fill={color} fillOpacity="0.15" />
          <circle cx="30" cy="30" r="3.5" fill={color} fillOpacity="0.6" />
          {/* Floral Tendril Swirls */}
          <path d="M 14,65 C 22,60 26,52 26,45 C 26,38 38,26 45,26 C 52,26 60,22 65,14" />
          <circle cx="14" cy="50" r="2" fill={color} />
          <circle cx="50" cy="14" r="2" fill={color} />
        </g>

        {/* ========== TOP-RIGHT ISLIMIY CORNER ORNAMENT ========== */}
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(300, 0) scale(-1, 1)">
          <path d="M 14,50 C 14,24 24,14 50,14" />
          <path d="M 14,36 C 20,28 28,20 36,14" />
          <path d="M 22,22 C 28,16 38,18 42,28 C 36,36 28,34 22,22 Z" fill={color} fillOpacity="0.15" />
          <circle cx="30" cy="30" r="3.5" fill={color} fillOpacity="0.6" />
          <path d="M 14,65 C 22,60 26,52 26,45 C 26,38 38,26 45,26 C 52,26 60,22 65,14" />
          <circle cx="14" cy="50" r="2" fill={color} />
          <circle cx="50" cy="14" r="2" fill={color} />
        </g>

        {/* ========== BOTTOM-LEFT ISLIMIY CORNER ORNAMENT ========== */}
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(0, 440) scale(1, -1)">
          <path d="M 14,50 C 14,24 24,14 50,14" />
          <path d="M 14,36 C 20,28 28,20 36,14" />
          <path d="M 22,22 C 28,16 38,18 42,28 C 36,36 28,34 22,22 Z" fill={color} fillOpacity="0.15" />
          <circle cx="30" cy="30" r="3.5" fill={color} fillOpacity="0.6" />
          <path d="M 14,65 C 22,60 26,52 26,45 C 26,38 38,26 45,26 C 52,26 60,22 65,14" />
          <circle cx="14" cy="50" r="2" fill={color} />
          <circle cx="50" cy="14" r="2" fill={color} />
        </g>

        {/* ========== BOTTOM-RIGHT ISLIMIY CORNER ORNAMENT ========== */}
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(300, 440) scale(-1, -1)">
          <path d="M 14,50 C 14,24 24,14 50,14" />
          <path d="M 14,36 C 20,28 28,20 36,14" />
          <path d="M 22,22 C 28,16 38,18 42,28 C 36,36 28,34 22,22 Z" fill={color} fillOpacity="0.15" />
          <circle cx="30" cy="30" r="3.5" fill={color} fillOpacity="0.6" />
          <path d="M 14,65 C 22,60 26,52 26,45 C 26,38 38,26 45,26 C 52,26 60,22 65,14" />
          <circle cx="14" cy="50" r="2" fill={color} />
          <circle cx="50" cy="14" r="2" fill={color} />
        </g>

        {/* ========== TOP CENTER CROWN MEDALLION (SHAMSA) ========== */}
        <g stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M 130,9 Q 150,2 170,9 Q 160,18 150,18 Q 140,18 130,9 Z" fill={color} fillOpacity="0.25" />
          <circle cx="150" cy="9" r="2.5" fill={color} />
          <path d="M 115,9 L 130,9 M 170,9 L 185,9" strokeDasharray="2 2" />
        </g>

        {/* ========== BOTTOM CENTER CROWN MEDALLION ========== */}
        <g stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" transform="translate(0, 440) scale(1, -1)">
          <path d="M 130,9 Q 150,2 170,9 Q 160,18 150,18 Q 140,18 130,9 Z" fill={color} fillOpacity="0.25" />
          <circle cx="150" cy="9" r="2.5" fill={color} />
          <path d="M 115,9 L 130,9 M 170,9 L 185,9" strokeDasharray="2 2" />
        </g>

        {/* ========== LEFT & RIGHT IKAT / DAMASK DIAMONDS ========== */}
        <g stroke={color} strokeWidth="1.2" strokeOpacity="0.6" fill="none">
          <polygon points="9,220 15,214 21,220 15,226" fill={color} fillOpacity="0.2" />
          <polygon points="279,220 285,214 291,220 285,226" fill={color} fillOpacity="0.2" />
        </g>
      </svg>
    </div>
  );
};
