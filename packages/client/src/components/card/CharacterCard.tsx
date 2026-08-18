import React, { useState } from 'react';
import { CardCategory, CardItem } from '@boshpana/shared';
import { 
  Briefcase, HeartPulse, Dna, Package, Sparkles, 
  FileText, Zap, Eye, EyeOff, Lock, Unlock,
  HelpCircle, Shield, AlertTriangle
} from 'lucide-react';
import { sound } from '../../services/sound';

interface CharacterCardProps {
  category: CardCategory;
  card: CardItem;
  isRevealed: boolean;
  isOwner: boolean;
  canReveal: boolean;
  onReveal?: () => void;
  onUseSpecial?: () => void;
}

const CATEGORY_META: Record<CardCategory, { 
  label: string; 
  icon: any; 
  color: string; 
  bgBadge: string; 
  borderGlow: string;
  girihColor: string;
}> = {
  profession: { 
    label: 'KASB', 
    icon: Briefcase, 
    color: 'text-amber-400', 
    bgBadge: 'bg-amber-500/20 border-amber-500/50 text-amber-300', 
    borderGlow: 'border-amber-500/40',
    girihColor: '#f59e0b'
  },
  biology: { 
    label: 'BIOLOGIYA', 
    icon: Dna, 
    color: 'text-cyan-400', 
    bgBadge: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300', 
    borderGlow: 'border-cyan-500/40',
    girihColor: '#06b6d4'
  },
  health: { 
    label: 'SALOMATLIK', 
    icon: HeartPulse, 
    color: 'text-emerald-400', 
    bgBadge: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300', 
    borderGlow: 'border-emerald-500/40',
    girihColor: '#10b981'
  },
  baggage: { 
    label: 'BAGAJ / BUYUM', 
    icon: Package, 
    color: 'text-orange-400', 
    bgBadge: 'bg-orange-500/20 border-orange-500/50 text-orange-300', 
    borderGlow: 'border-orange-500/40',
    girihColor: '#f97316'
  },
  hobby: { 
    label: 'XOBBI / KO\'NIKMA', 
    icon: Sparkles, 
    color: 'text-purple-400', 
    bgBadge: 'bg-purple-500/20 border-purple-500/50 text-purple-300', 
    borderGlow: 'border-purple-500/40',
    girihColor: '#a855f7'
  },
  fact: { 
    label: 'FAKT / SIR', 
    icon: FileText, 
    color: 'text-yellow-400', 
    bgBadge: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300', 
    borderGlow: 'border-yellow-500/40',
    girihColor: '#eab308'
  },
  special: { 
    label: 'MAXSUS QOBILIYAT', 
    icon: Zap, 
    color: 'text-hazard-orange', 
    bgBadge: 'bg-hazard-orange/25 border-hazard-orange text-hazard-orange', 
    borderGlow: 'border-hazard-orange/60',
    girihColor: '#ff4c29'
  }
};

export const CharacterCard: React.FC<CharacterCardProps> = ({
  category,
  card,
  isRevealed,
  isOwner,
  canReveal,
  onReveal,
  onUseSpecial
}) => {
  const [isPeeking, setIsPeeking] = useState(false);
  const meta = CATEGORY_META[category] || { 
    label: category, 
    icon: HelpCircle, 
    color: 'text-slate-400', 
    bgBadge: 'bg-slate-800 text-slate-300',
    borderGlow: 'border-slate-800',
    girihColor: '#64748b'
  };
  const IconComponent = meta.icon;

  const showContent = isRevealed || (isOwner && isPeeking);

  const handleTogglePeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPeeking) sound.playPeek();
    else sound.playClick();
    setIsPeeking(!isPeeking);
  };

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canReveal && onReveal) {
      sound.playCardFlip();
      onReveal();
    }
  };

  return (
    <div className={`relative rounded-2xl p-4 transition-all duration-300 border-2 overflow-hidden group shadow-lg ${
      isRevealed 
        ? `bg-bunker-900/95 ${meta.borderGlow} shadow-hazard-sm` 
        : showContent
          ? 'bg-bunker-900 border-hazard-orange/60 shadow-hazard-md'
          : 'bg-bunker-950/90 border-slate-800/80 hover:border-slate-700'
    }`}>
      
      {/* ================= PROMINENT UZBEK GIRIH CORNER MOTIFS ================= */}
      {/* Top-Left Girih Star Knot */}
      <svg className="absolute top-0 left-0 w-10 h-10 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity" viewBox="0 0 40 40" fill="none">
        <path d="M2 2H18M2 2V18M2 2L14 14M2 10L10 2M2 18L18 2M6 2L2 6M10 10L18 18M10 18L18 10" stroke={meta.girihColor} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,4 14,8 10,12 6,8" stroke={meta.girihColor} strokeWidth="1.2" fill="none" />
      </svg>
      {/* Top-Right Girih Star Knot */}
      <svg className="absolute top-0 right-0 w-10 h-10 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity rotate-90" viewBox="0 0 40 40" fill="none">
        <path d="M2 2H18M2 2V18M2 2L14 14M2 10L10 2M2 18L18 2M6 2L2 6M10 10L18 18M10 18L18 10" stroke={meta.girihColor} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,4 14,8 10,12 6,8" stroke={meta.girihColor} strokeWidth="1.2" fill="none" />
      </svg>
      {/* Bottom-Right Girih Star Knot */}
      <svg className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity rotate-180" viewBox="0 0 40 40" fill="none">
        <path d="M2 2H18M2 2V18M2 2L14 14M2 10L10 2M2 18L18 2M6 2L2 6M10 10L18 18M10 18L18 10" stroke={meta.girihColor} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,4 14,8 10,12 6,8" stroke={meta.girihColor} strokeWidth="1.2" fill="none" />
      </svg>
      {/* Bottom-Left Girih Star Knot */}
      <svg className="absolute bottom-0 left-0 w-10 h-10 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity -rotate-90" viewBox="0 0 40 40" fill="none">
        <path d="M2 2H18M2 2V18M2 2L14 14M2 10L10 2M2 18L18 2M6 2L2 6M10 10L18 18M10 18L18 10" stroke={meta.girihColor} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,4 14,8 10,12 6,8" stroke={meta.girihColor} strokeWidth="1.2" fill="none" />
      </svg>

      {/* Header: Category Badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10 pl-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-black uppercase tracking-widest ${meta.bgBadge}`}>
          <IconComponent size={14} />
          <span>{meta.label}</span>
        </div>

        {/* State Indicator */}
        <div className="flex items-center gap-1">
          {isRevealed ? (
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 flex items-center gap-1">
              <Unlock size={10} /> Ochiq
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
              <Lock size={10} /> Maxfiy
            </span>
          )}
        </div>
      </div>

      {/* Card Body & Title */}
      {showContent ? (
        <div className="space-y-2 relative z-10 animate-fadeIn min-h-[85px] flex flex-col justify-center py-1">
          <div className="flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-bunker-950 border flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.borderGlow} ${meta.color}`}>
              <IconComponent size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-black text-slate-100 leading-tight">
                {card.title}
              </h4>
              {card.theme && (
                <span className="inline-block mt-0.5 text-[9px] font-mono uppercase text-slate-400 px-1.5 py-0.2 rounded bg-bunker-950 border border-slate-800">
                  {card.theme === 'uzbek' ? '🇺🇿 O\'zbekona' : card.theme === 'nsfw18' ? '🔴 18+ Qora' : '🟢 Klassik'}
                </span>
              )}
            </div>
          </div>

          {card.description && (
            <p className="text-xs text-slate-300 leading-relaxed pl-10 border-l border-slate-800/80 mt-1">
              {card.description}
            </p>
          )}

          {/* Disaster specific badge if any */}
          {card.disasterSpecificId && (
            <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              <AlertTriangle size={11} />
              <span>Falokatga mos maxsus karta!</span>
            </div>
          )}
        </div>
      ) : (
        <div className="py-7 flex flex-col items-center justify-center text-center relative z-10 space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-bunker-950 border-2 border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-slate-400 group-hover:border-slate-700 transition-colors">
            <Lock size={22} />
          </div>
          <p className="text-xs text-slate-500 font-mono">Karta yashirin holda</p>
        </div>
      )}

      {/* Action Buttons for Owner */}
      {isOwner && !isRevealed && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between gap-2 relative z-10">
          {/* Peek button */}
          <button
            type="button"
            onClick={handleTogglePeek}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            {isPeeking ? <EyeOff size={14} className="text-amber-400" /> : <Eye size={14} className="text-cyan-400" />}
            <span>{isPeeking ? 'Yopish' : 'Maxfiy Ko\'rish'}</span>
          </button>

          {/* Reveal button */}
          {canReveal && (
            <button
              type="button"
              onClick={handleReveal}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-1.5 shadow-hazard-md transition-all active:scale-95 animate-pulse"
            >
              <Unlock size={14} />
              <span>Hammaga Ochish</span>
            </button>
          )}
        </div>
      )}

      {/* Special Card Trigger Button */}
      {isOwner && category === 'special' && isRevealed && onUseSpecial && (
        <div className="mt-3 pt-2 border-t border-hazard-orange/40 relative z-10">
          <button
            type="button"
            onClick={onUseSpecial}
            className="w-full py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-hazard-orange/20 hover:bg-hazard-orange/30 text-hazard-orange border border-hazard-orange/60 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Zap size={15} />
            <span>Qobiliyatni Ishga Tushirish</span>
          </button>
        </div>
      )}
    </div>
  );
};
