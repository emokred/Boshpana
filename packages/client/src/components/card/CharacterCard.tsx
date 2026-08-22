import React, { useState } from 'react';
import { CardCategory, CardItem } from '@boshpana/shared';
import { 
  Briefcase, HeartPulse, Dna, Package, Sparkles, 
  FileText, Zap, Eye, EyeOff, Lock, Unlock,
  HelpCircle, AlertTriangle
} from 'lucide-react';
import { sound } from '../../services/sound';
import { CardArt } from './CardArt';
import { UzbekCardFrame } from './UzbekCardFrame';

interface CharacterCardProps {
  category: CardCategory;
  card: CardItem;
  isRevealed: boolean;
  isOwner: boolean;
  canReveal: boolean;
  onReveal?: () => void;
  onUseSpecial?: () => void;
}

const CATEGORY_THEME: Record<CardCategory, { 
  label: string; 
  icon: any; 
  color: string; 
  accentHex: string;
  bgBadge: string; 
  titleBg: string;
}> = {
  profession: { 
    label: 'KASB', 
    icon: Briefcase, 
    color: 'text-amber-400', 
    accentHex: '#f59e0b',
    bgBadge: 'bg-amber-500/20 border-amber-500/70 text-amber-300', 
    titleBg: 'bg-amber-950/90 border-amber-500/80 text-amber-100'
  },
  biology: { 
    label: 'BIOLOGIYA', 
    icon: Dna, 
    color: 'text-cyan-400', 
    accentHex: '#06b6d4',
    bgBadge: 'bg-cyan-500/20 border-cyan-500/70 text-cyan-300', 
    titleBg: 'bg-cyan-950/90 border-cyan-500/80 text-cyan-100'
  },
  health: { 
    label: 'SALOMATLIK', 
    icon: HeartPulse, 
    color: 'text-emerald-400', 
    accentHex: '#10b981',
    bgBadge: 'bg-emerald-500/20 border-emerald-500/70 text-emerald-300', 
    titleBg: 'bg-emerald-950/90 border-emerald-500/80 text-emerald-100'
  },
  baggage: { 
    label: 'BAGAJ', 
    icon: Package, 
    color: 'text-orange-400', 
    accentHex: '#f97316',
    bgBadge: 'bg-orange-500/20 border-orange-500/70 text-orange-300', 
    titleBg: 'bg-orange-950/90 border-orange-500/80 text-orange-100'
  },
  hobby: { 
    label: 'XOBBI', 
    icon: Sparkles, 
    color: 'text-purple-400', 
    accentHex: '#a855f7',
    bgBadge: 'bg-purple-500/20 border-purple-500/70 text-purple-300', 
    titleBg: 'bg-purple-950/90 border-purple-500/80 text-purple-100'
  },
  fact: { 
    label: 'FAKT', 
    icon: FileText, 
    color: 'text-yellow-400', 
    accentHex: '#eab308',
    bgBadge: 'bg-yellow-500/20 border-yellow-500/70 text-yellow-300', 
    titleBg: 'bg-yellow-950/90 border-yellow-500/80 text-yellow-100'
  },
  special: { 
    label: 'MAXSUS', 
    icon: Zap, 
    color: 'text-hazard-orange', 
    accentHex: '#ff4c29',
    bgBadge: 'bg-hazard-orange/25 border-hazard-orange text-hazard-orange', 
    titleBg: 'bg-red-950 border-hazard-orange text-white'
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
  const meta = CATEGORY_THEME[category] || { 
    label: category, 
    icon: HelpCircle, 
    color: 'text-slate-400', 
    accentHex: '#64748b',
    bgBadge: 'bg-slate-800 text-slate-300',
    titleBg: 'bg-slate-900 text-slate-100'
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
    <div className={`relative rounded-3xl p-3 sm:p-4 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-2xl ${
      isRevealed 
        ? 'bg-bunker-900/95 shadow-card-glow border border-slate-700/50' 
        : showContent
          ? 'bg-bunker-900 shadow-hazard-md border border-hazard-orange/40'
          : 'bg-bunker-950/95 border border-slate-800/80 hover:border-slate-700'
    } min-h-[290px]`}>
      
      {/* Uzbek Islimiy / Shamsa Border Frame */}
      <UzbekCardFrame color={meta.accentHex} />

      {/* TOP: Category Badge & Status */}
      <div className="flex items-center justify-between gap-2 relative z-20 pt-1 px-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest shadow-sm ${meta.bgBadge}`}>
          <IconComponent size={13} />
          <span>{meta.label}</span>
        </div>

        {/* State Indicator */}
        <div className="flex items-center gap-1">
          {isRevealed ? (
            <span className="text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 flex items-center gap-1 shadow-sm">
              <Unlock size={10} /> Ochiq
            </span>
          ) : (
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
              <Lock size={10} /> Maxfiy
            </span>
          )}
        </div>
      </div>

      {/* CENTER: Fixed-Size Uniform Card Art (No Description Clutter) */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-1 px-1">
        {showContent ? (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <CardArt
              cardId={card.id}
              category={category}
              title={card.title}
              color={meta.accentHex}
              isRevealed={isRevealed}
            />

            {/* Disaster specific badge if any */}
            {card.disasterSpecificId && (
              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-800/60">
                <AlertTriangle size={10} />
                <span>Falokatga mos!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div 
              className="w-16 h-16 rounded-2xl bg-bunker-950 border-2 flex items-center justify-center text-slate-600 group-hover:text-slate-400 group-hover:border-slate-700 transition-colors shadow-inner"
              style={{ borderColor: `${meta.accentHex}40` }}
            >
              <Lock size={28} style={{ color: `${meta.accentHex}90` }} />
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Yashirin Karta</p>
          </div>
        )}
      </div>

      {/* BOTTOM: Bold Clean Title Banner (No long description text) */}
      <div className="relative z-20 space-y-2 px-1">
        {showContent ? (
          <div className={`p-2.5 rounded-2xl border-2 text-center shadow-lg transition-transform ${meta.titleBg}`}>
            <h4 className="text-xs sm:text-sm font-black tracking-wide uppercase leading-snug drop-shadow-md">
              {card.title}
            </h4>
          </div>
        ) : (
          <div className="p-2.5 rounded-2xl border border-slate-800 bg-bunker-950/80 text-center">
            <span className="text-[11px] text-slate-600 font-mono uppercase tracking-widest">??? [Yashirin] ???</span>
          </div>
        )}

        {/* Owner Controls (Peek / Reveal) */}
        {isOwner && !isRevealed && (
          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleTogglePeek}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              {isPeeking ? <EyeOff size={13} className="text-amber-400" /> : <Eye size={13} className="text-cyan-400" />}
              <span>{isPeeking ? 'Yopish' : 'Ko\'rish'}</span>
            </button>

            {canReveal && (
              <button
                type="button"
                onClick={handleReveal}
                className="flex-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-1 shadow-hazard-md transition-all active:scale-95 animate-pulse"
              >
                <Unlock size={13} />
                <span>Hammaga Ochish</span>
              </button>
            )}
          </div>
        )}

        {/* Special Card Trigger Action */}
        {isOwner && category === 'special' && isRevealed && onUseSpecial && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onUseSpecial}
              className="w-full py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-hazard-orange/20 hover:bg-hazard-orange/30 text-hazard-orange border border-hazard-orange/60 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Zap size={14} />
              <span>Qobiliyatni Ishlatish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
