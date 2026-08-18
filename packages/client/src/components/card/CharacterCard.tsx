import React, { useState } from 'react';
import { CardCategory, CardItem } from '@boshpana/shared';
import { 
  Briefcase, HeartPulse, Dna, Package, Sparkles, 
  FileText, Zap, Eye, EyeOff, Lock, Unlock, ShieldAlert,
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

const CATEGORY_META: Record<CardCategory, { label: string; icon: any; color: string; bgBadge: string }> = {
  profession: { label: 'KASB', icon: Briefcase, color: 'text-amber-400', bgBadge: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
  biology: { label: 'BIOLOGIYA', icon: Dna, color: 'text-cyan-400', bgBadge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' },
  health: { label: 'SALOMATLIK', icon: HeartPulse, color: 'text-emerald-400', bgBadge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
  baggage: { label: 'BAGAJ', icon: Package, color: 'text-orange-400', bgBadge: 'bg-orange-500/20 border-orange-500/40 text-orange-300' },
  hobby: { label: 'XOBBI / KO\'NIKMA', icon: Sparkles, color: 'text-purple-400', bgBadge: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
  fact: { label: 'FAKT', icon: FileText, color: 'text-yellow-400', bgBadge: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
  special: { label: 'MAXSUS KARTA', icon: Zap, color: 'text-hazard-orange', bgBadge: 'bg-hazard-orange/20 border-hazard-orange/50 text-hazard-orange' }
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
  const meta = CATEGORY_META[category] || { label: category, icon: HelpCircle, color: 'text-slate-400', bgBadge: 'bg-slate-800 text-slate-300' };
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
    <div className={`relative rounded-xl p-3.5 transition-all duration-300 border ${
      isRevealed 
        ? 'bg-bunker-850/90 border-slate-700/80 shadow-md' 
        : showContent
          ? 'bg-bunker-900 border-hazard-orange/40 shadow-hazard-sm'
          : 'bg-bunker-950/80 border-slate-800/80'
    } girih-card overflow-hidden`}>
      
      {/* Background Subtle Watermark Icon */}
      <div className="absolute right-2 -bottom-2 opacity-5 pointer-events-none text-slate-100">
        <IconComponent size={64} />
      </div>

      {/* Header with Category Badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
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
        <div className="space-y-1.5 animate-fadeIn">
          <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-xs text-slate-300 leading-relaxed">
              {card.description}
            </p>
          )}

          {/* Impact stats if any */}
          {card.impactScore && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {card.impactScore.food && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${card.impactScore.food > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  🍲 Oziq: {card.impactScore.food > 0 ? `+${card.impactScore.food}` : card.impactScore.food}
                </span>
              )}
              {card.impactScore.medical && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${card.impactScore.medical > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  💊 Tibbiyot: {card.impactScore.medical > 0 ? `+${card.impactScore.medical}` : card.impactScore.medical}
                </span>
              )}
              {card.impactScore.tech && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${card.impactScore.tech > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  ⚡ Texnika: {card.impactScore.tech > 0 ? `+${card.impactScore.tech}` : card.impactScore.tech}
                </span>
              )}
              {card.impactScore.defense && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${card.impactScore.defense > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  🛡️ Himoya: {card.impactScore.defense > 0 ? `+${card.impactScore.defense}` : card.impactScore.defense}
                </span>
              )}
              {card.impactScore.psychology && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${card.impactScore.psychology > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  🧠 Ruh: {card.impactScore.psychology > 0 ? `+${card.impactScore.psychology}` : card.impactScore.psychology}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-bunker-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-1.5">
            <Lock size={18} />
          </div>
          <p className="text-xs text-slate-400 font-mono">Karta hali ochilmagan</p>
        </div>
      )}

      {/* Action Buttons for Owner */}
      {isOwner && !isRevealed && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Peek button */}
          <button
            type="button"
            onClick={handleTogglePeek}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700/80 flex items-center gap-1 transition-colors active:scale-95"
          >
            {isPeeking ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{isPeeking ? 'Yopish' : 'Ko\'rish'}</span>
          </button>

          {/* Reveal button */}
          {canReveal && (
            <button
              type="button"
              onClick={handleReveal}
              className="flex-1 px-3 py-1 rounded-lg text-xs font-bold bg-hazard-orange hover:bg-hazard-orangeDark text-white flex items-center justify-center gap-1.5 shadow-hazard-sm transition-all active:scale-95 animate-pulse"
            >
              <Unlock size={13} />
              <span>Hammaga Ochish</span>
            </button>
          )}
        </div>
      )}

      {/* Special card trigger button */}
      {isOwner && category === 'special' && isRevealed && onUseSpecial && (
        <div className="mt-3 pt-2 border-t border-hazard-orange/30">
          <button
            type="button"
            onClick={onUseSpecial}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-hazard-orange/20 hover:bg-hazard-orange/30 text-hazard-orange border border-hazard-orange/40 flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Zap size={14} />
            <span>Qobiliyatni Ishlatish</span>
          </button>
        </div>
      )}
    </div>
  );
};
