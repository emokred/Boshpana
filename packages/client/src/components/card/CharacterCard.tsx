import React, { useState } from 'react';
import { CardCategory, CardItem } from '@boshpana/shared';
import { 
  Briefcase, HeartPulse, Dna, Package, Sparkles, 
  FileText, Zap, Eye, EyeOff, Lock, Unlock,
  HelpCircle
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

const CATEGORY_META: Record<CardCategory, { label: string; icon: any; color: string; bgBadge: string; borderAccent: string }> = {
  profession: { label: 'KASB', icon: Briefcase, color: 'text-amber-400', bgBadge: 'bg-amber-500/20 border-amber-500/40 text-amber-300', borderAccent: '#f59e0b' },
  biology: { label: 'BIOLOGIYA', icon: Dna, color: 'text-cyan-400', bgBadge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', borderAccent: '#06b6d4' },
  health: { label: 'SALOMATLIK', icon: HeartPulse, color: 'text-emerald-400', bgBadge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', borderAccent: '#10b981' },
  baggage: { label: 'BAGAJ', icon: Package, color: 'text-orange-400', bgBadge: 'bg-orange-500/20 border-orange-500/40 text-orange-300', borderAccent: '#f97316' },
  hobby: { label: 'XOBBI / KO\'NIKMA', icon: Sparkles, color: 'text-purple-400', bgBadge: 'bg-purple-500/20 border-purple-500/40 text-purple-300', borderAccent: '#a855f7' },
  fact: { label: 'FAKT', icon: FileText, color: 'text-yellow-400', bgBadge: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300', borderAccent: '#eab308' },
  special: { label: 'MAXSUS KARTA', icon: Zap, color: 'text-hazard-orange', bgBadge: 'bg-hazard-orange/20 border-hazard-orange/50 text-hazard-orange', borderAccent: '#ff4c29' }
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
    borderAccent: '#64748b'
  };
  const IconComponent = meta.icon;

  const showContent = isRevealed || (isOwner && isPeeking);

  const handleTogglePeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
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
    <div className={`relative rounded-2xl p-4 transition-all duration-300 border ${
      isRevealed 
        ? 'bg-bunker-900/90 border-slate-700/80 shadow-card-glow' 
        : showContent
          ? 'bg-bunker-900 border-hazard-orange/50 shadow-hazard-sm'
          : 'bg-bunker-950/90 border-slate-800/80'
    } overflow-hidden group`}>
      
      {/* Uzbek Girih Geometric Corner SVG Ornaments */}
      <svg className="absolute top-0 left-0 w-6 h-6 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" viewBox="0 0 24 24" fill="none">
        <path d="M2 2H10M2 2V10M2 2L8 8M6 2L2 6M10 2L2 10" stroke={meta.borderAccent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="absolute top-0 right-0 w-6 h-6 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity rotate-90" viewBox="0 0 24 24" fill="none">
        <path d="M2 2H10M2 2V10M2 2L8 8M6 2L2 6M10 2L2 10" stroke={meta.borderAccent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity rotate-180" viewBox="0 0 24 24" fill="none">
        <path d="M2 2H10M2 2V10M2 2L8 8M6 2L2 6M10 2L2 10" stroke={meta.borderAccent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity -rotate-90" viewBox="0 0 24 24" fill="none">
        <path d="M2 2H10M2 2V10M2 2L8 8M6 2L2 6M10 2L2 10" stroke={meta.borderAccent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Header with Category Badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-wider ${meta.bgBadge}`}>
          <IconComponent size={13} />
          <span>{meta.label}</span>
        </div>

        {/* State icon */}
        <div className="flex items-center gap-1">
          {isRevealed ? (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
              <Unlock size={10} /> Ochiq
            </span>
          ) : (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
              <Lock size={10} /> Yashirin
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      {showContent ? (
        <div className="space-y-1.5 relative z-10 animate-fadeIn min-h-[70px] flex flex-col justify-center">
          <h4 className="text-sm sm:text-base font-black text-slate-100 leading-snug">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {card.description}
            </p>
          )}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-10 h-10 rounded-full bg-bunker-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-1.5">
            <Lock size={18} />
          </div>
          <p className="text-xs text-slate-500 font-mono">Karta hali ochilmagan</p>
        </div>
      )}

      {/* Action Buttons for Owner */}
      {isOwner && !isRevealed && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 relative z-10">
          {/* Peek button */}
          <button
            type="button"
            onClick={handleTogglePeek}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition-colors active:scale-95"
          >
            {isPeeking ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{isPeeking ? 'Yopish' : 'Maxfiy Ko\'rish'}</span>
          </button>

          {/* Reveal button */}
          {canReveal && (
            <button
              type="button"
              onClick={handleReveal}
              className="flex-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-1.5 shadow-hazard-sm transition-all active:scale-95 animate-pulse"
            >
              <Unlock size={13} />
              <span>Hammaga Ochish</span>
            </button>
          )}
        </div>
      )}

      {/* Special card trigger button */}
      {isOwner && category === 'special' && isRevealed && onUseSpecial && (
        <div className="mt-3 pt-2 border-t border-hazard-orange/30 relative z-10">
          <button
            type="button"
            onClick={onUseSpecial}
            className="w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-hazard-orange/20 hover:bg-hazard-orange/30 text-hazard-orange border border-hazard-orange/40 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Zap size={14} />
            <span>Qobiliyatni Ishlatish</span>
          </button>
        </div>
      )}
    </div>
  );
};
