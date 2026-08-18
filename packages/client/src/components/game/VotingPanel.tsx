import React, { useState } from 'react';
import { Player, VotingMode } from '@boshpana/shared';
import { Vote, ShieldAlert, UserX, CheckCircle, Lock, Eye } from 'lucide-react';
import { sound } from '../../services/sound';

interface VotingPanelProps {
  players: Record<string, Player>;
  myPlayerId: string;
  votingMode: VotingMode;
  onCastVote: (targetPlayerId: string) => void;
}

export const VotingPanel: React.FC<VotingPanelProps> = ({
  players,
  myPlayerId,
  votingMode,
  onCastVote
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const myPlayer = players[myPlayerId];
  const hasVoted = myPlayer?.hasVoted;

  const alivePlayers = Object.values(players).filter((p) => p.isAlive);
  const totalVotesCast = alivePlayers.filter((p) => p.hasVoted).length;

  const handleVoteSubmit = () => {
    if (selectedTargetId && !hasVoted) {
      sound.playVoteGong();
      onCastVote(selectedTargetId);
    }
  };

  return (
    <div className="bg-bunker-900 border-2 border-hazard-orange/50 rounded-2xl p-4 sm:p-6 shadow-hazard-lg space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-hazard-orange/20 border border-hazard-orange/40 flex items-center justify-center text-hazard-orange">
            <Vote size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-100 uppercase tracking-wide">
              Ovoz Berish Bosqichi
            </h3>
            <p className="text-xs text-slate-400">
              Boshpanadan kimni chiqarib yuborishni hal qiling!
            </p>
          </div>
        </div>

        {/* Voting Mode Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border bg-bunker-950 text-slate-300 border-slate-700">
          {votingMode === 'open' ? (
            <>
              <Eye size={12} className="text-emerald-400" />
              <span>Ochiq Ovoz</span>
            </>
          ) : (
            <>
              <Lock size={12} className="text-yellow-400" />
              <span>Anonim Ovoz</span>
            </>
          )}
        </div>
      </div>

      {/* Vote Progress Tracker */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Ovoz berganlar:</span>
        <span className="font-bold text-slate-200">{totalVotesCast} / {alivePlayers.length} kishi</span>
      </div>

      {/* Players List to Vote against */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
        {alivePlayers.map((player) => {
          const isMe = player.id === myPlayerId;
          const isSelected = selectedTargetId === player.id;
          const profCard = player.cards.profession?.card;

          return (
            <button
              key={player.id}
              type="button"
              disabled={hasVoted || isMe}
              onClick={() => {
                sound.playClick();
                setSelectedTargetId(player.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 relative overflow-hidden ${
                isMe
                  ? 'opacity-40 cursor-not-allowed border-slate-800 bg-bunker-950/60'
                  : hasVoted
                    ? player.votedForPlayerId === player.id
                      ? 'border-hazard-orange bg-hazard-orange/10'
                      : 'border-slate-800 bg-bunker-950'
                    : isSelected
                      ? 'border-hazard-orange bg-hazard-orange/20 shadow-hazard-sm scale-[1.02]'
                      : 'border-slate-800 bg-bunker-950/90 hover:border-slate-700 hover:bg-bunker-850'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-100 truncate">
                    {player.displayName}
                  </span>
                  {isMe && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      (Siz)
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-400 truncate mt-0.5 font-medium">
                  {player.cards.profession?.isRevealed ? profCard?.title : '❓ Kasbi yashirin'}
                </p>
              </div>

              {/* Vote Count Indicator (if open voting or player voted) */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {votingMode === 'open' && player.receivedVotesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-950/90 text-red-400 border border-red-800 font-mono text-xs font-bold">
                    {player.receivedVotesCount} ta
                  </span>
                )}
                {player.hasVoted && (
                  <CheckCircle size={14} className="text-emerald-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Confirm Vote Button */}
      {!hasVoted ? (
        <button
          type="button"
          disabled={!selectedTargetId}
          onClick={handleVoteSubmit}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            selectedTargetId
              ? 'bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white shadow-hazard-sm active:scale-98 animate-pulse'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <UserX size={18} />
          <span>Ovozni Tasdiqlash</span>
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs sm:text-sm text-center font-medium flex items-center justify-center gap-2">
          <CheckCircle size={16} />
          <span>Ovozingiz qabul qilindi. Boshqalar ovoz berishini kuting...</span>
        </div>
      )}
    </div>
  );
};
