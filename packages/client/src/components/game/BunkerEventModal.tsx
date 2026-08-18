import React from 'react';
import { BunkerEvent } from '@boshpana/shared';
import { Sparkles, AlertTriangle, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../../services/sound';

interface BunkerEventModalProps {
  event: BunkerEvent;
  isHost: boolean;
  onAcknowledge: () => void;
}

export const BunkerEventModal: React.FC<BunkerEventModalProps> = ({
  event,
  isHost,
  onAcknowledge
}) => {
  const isPositive = event.type === 'positive';
  const isNegative = event.type === 'negative';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className={`bg-bunker-900 border-2 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden ${
        isPositive 
          ? 'border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
          : isNegative 
            ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            : 'border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
      }`}>
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Sparkles size={20} />
              </span>
            ) : isNegative ? (
              <span className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800">
                <AlertTriangle size={20} />
              </span>
            ) : (
              <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Info size={20} />
              </span>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Boshpana Hodisasi (Kutilmagan Voqea)
              </span>
              <span className={`text-xs font-mono font-bold uppercase ${
                isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-cyan-400'
              }`}>
                {isPositive ? '✨ Ijobiy Yangilik' : isNegative ? '⚠️ Xavf / Yo\'qotish' : '📻 Neytral Xabar'}
              </span>
            </div>
          </div>
        </div>

        {/* Event Title & Body */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-snug">
            {event.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {event.description}
          </p>

          {/* Impact Banner */}
          <div className={`p-3.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2.5 ${
            isPositive
              ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300'
              : isNegative
                ? 'bg-red-950/70 border-red-700/60 text-red-300'
                : 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300'
          }`}>
            <Zap size={16} className="flex-shrink-0 animate-pulse" />
            <span>{event.impactText}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isHost ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onAcknowledge();
              }}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-2 shadow-hazard-md transition-all active:scale-98"
            >
              <span>Keyingi Raundga O'tish</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <p className="text-xs text-center text-slate-500 font-mono italic">
              Host keyingi raundni boshlashini kuting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
