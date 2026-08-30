import React from 'react';
import { Player, CardCategory } from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { Skull, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { sound } from '../../services/sound';

interface EliminationRevealModalProps {
  eliminatedPlayer: Player;
  isHost?: boolean;
  onContinue: () => void;
}

export const EliminationRevealModal: React.FC<EliminationRevealModalProps> = ({
  eliminatedPlayer,
  isHost = true,
  onContinue
}) => {
  const cards = eliminatedPlayer.cards;
  const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#161b22] border-4 border-red-600 rounded-3xl p-5 sm:p-8 max-w-4xl w-full space-y-6 shadow-[0_0_50px_rgba(220,38,38,0.5)] my-auto">
        
        {/* Header Alert */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center mx-auto text-3xl shadow-lg animate-bounce">
            <Skull size={34} className="text-red-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            ❌ {eliminatedPlayer.displayName} BOSHPANADAN CHIQARIB YUBORILDI!
          </h2>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800 text-xs font-mono font-bold text-red-300">
            <Eye size={14} />
            <span>O'yinchining barcha yashirin kartalari ochilmoqda:</span>
          </div>
        </div>

        {/* 7 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[55vh] overflow-y-auto p-1">
          {categories.map((cat) => {
            const slot = cards[cat];
            if (!slot || !slot.card) return null;
            return (
              <div key={cat} className="transform hover:scale-102 transition-transform">
                <CharacterCard
                  category={cat}
                  card={slot.card}
                  isRevealed={true}
                  isOwner={true}
                  canReveal={false}
                />
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isHost ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 animate-pulse"
            >
              <span>Navbatdagi Bosqichga O'tish</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <p className="text-center text-xs font-mono text-slate-400">
              Xona egasi (Host) navbatdagi bosqichni boshlashini kuting...
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
