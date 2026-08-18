import React, { useState } from 'react';
import { GameRoomState, CardCategory, CardItem } from '@boshpana/shared';
import { 
  AlertTriangle, Users, MessageSquare, Shield, Skull, 
  Crown, Volume2, VolumeX, Eye, Send, Smile, Lock
} from 'lucide-react';
import { CharacterCard } from '../card/CharacterCard';
import { TimerBar } from './TimerBar';
import { VotingPanel } from './VotingPanel';
import { SimulationView } from './SimulationView';
import { DisasterModal } from './DisasterModal';
import { sound } from '../../services/sound';

interface GameBoardViewProps {
  roomState: GameRoomState;
  myPlayerId: string;
  onRevealCard: (category: CardCategory) => void;
  onEndTurn: () => void;
  onCastVote: (targetPlayerId: string) => void;
  onUseSpecial: (targetPlayerId?: string) => void;
  onSendChatMessage: (text: string) => void;
  onPauseToggle: () => void;
  onAdd30Sec: () => void;
  onStartRounds: () => void;
  onPlayAgain: () => void;
}

const QUICK_REACTIONS = ['🔥', '💀', '💩', '🤡', '🛡️', '💊', '🍲', '⚡'];

export const GameBoardView: React.FC<GameBoardViewProps> = ({
  roomState,
  myPlayerId,
  onRevealCard,
  onEndTurn,
  onCastVote,
  onUseSpecial,
  onSendChatMessage,
  onPauseToggle,
  onAdd30Sec,
  onStartRounds,
  onPlayAgain
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(myPlayerId);
  const [showDisasterModal, setShowDisasterModal] = useState<boolean>(roomState.phase === 'DISASTER_INTRO');
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const myPlayer = roomState.players[myPlayerId];
  const isHost = myPlayer?.isHost;
  const isMyTurn = roomState.activeSpeakerPlayerId === myPlayerId;
  const activeSpeaker = roomState.activeSpeakerPlayerId ? roomState.players[roomState.activeSpeakerPlayerId] : null;
  const targetPlayer = roomState.players[selectedPlayerId] || myPlayer;

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sound.playClick();
      onSendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleQuickReaction = (emoji: string) => {
    sound.playClick();
    onSendChatMessage(emoji);
  };

  // Determine what phase label to show
  let phaseLabel = 'APOKALIPSIS';
  if (roomState.phase === 'DISASTER_INTRO') phaseLabel = 'FALOKAT E\'LONI';
  else if (roomState.phase === 'ROUND_PITCH') phaseLabel = `${roomState.roundNumber}-RAUND: PITCH (KARTA OCHISH)`;
  else if (roomState.phase === 'ROUND_DEBATE') phaseLabel = 'UMUMIY BAHS (MUHOKAMA)';
  else if (roomState.phase === 'VOTING') phaseLabel = 'OVOZ BERISH';
  else if (roomState.phase === 'VOTE_RESULTS') phaseLabel = 'RAUND NATIJASI';
  else if (roomState.phase === 'FINAL_SIMULATION') phaseLabel = 'BOSHPANA TAQDIRI';
  else if (roomState.phase === 'GAME_OVER') phaseLabel = 'O\'YIN TUGADI';

  // Rule: Round 1 requires profession, Round 2+ allows ANY hidden card to be revealed
  const isRound1 = roomState.roundNumber === 1;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn pb-24">
      
      {/* Top Header: Disaster Banner & Controls */}
      <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md">
        <button
          type="button"
          onClick={() => { sound.playClick(); setShowDisasterModal(true); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-hazard-orange/15 hover:bg-hazard-orange/25 border border-hazard-orange/40 text-hazard-orange transition-colors min-w-0"
        >
          <AlertTriangle size={16} className="flex-shrink-0 animate-pulse" />
          <div className="text-left truncate">
            <span className="text-[9px] font-mono block uppercase tracking-wider text-slate-400">Falokat</span>
            <span className="text-xs sm:text-sm font-bold truncate block">{roomState.catastrophe?.title || 'Apokalipsis'}</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Target Survivors Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bunker-950 border border-slate-800 text-xs font-mono">
            <Shield size={13} className="text-cyan-400" />
            <span className="text-slate-400">Joylar:</span>
            <span className="font-bold text-amber-400">{roomState.settings.targetSurvivors} ta</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-bunker-950 hover:bg-bunker-800 text-slate-300 border border-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>

          {/* Quick Chat Toggle */}
          <button
            type="button"
            onClick={() => { sound.playClick(); setIsChatOpen(!isChatOpen); }}
            className="p-2 rounded-xl bg-bunker-950 hover:bg-bunker-800 text-slate-300 border border-slate-800 transition-colors relative"
          >
            <MessageSquare size={16} className="text-cyan-400" />
            {roomState.chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-hazard-orange rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Timer Bar */}
      {(roomState.phase === 'ROUND_PITCH' || roomState.phase === 'ROUND_DEBATE' || roomState.phase === 'VOTING') && (
        <TimerBar
          timeRemainingSec={roomState.phaseTimeRemainingSec}
          totalDurationSec={roomState.phase === 'ROUND_PITCH' ? roomState.settings.turnDurationSec : roomState.settings.debateDurationSec}
          isPaused={roomState.isTimerPaused}
          activeSpeakerName={activeSpeaker?.displayName}
          isMyTurn={isMyTurn && roomState.phase === 'ROUND_PITCH'}
          isHost={!!isHost}
          phaseLabel={phaseLabel}
          onPauseToggle={onPauseToggle}
          onAdd30Sec={onAdd30Sec}
          onEndTurn={onEndTurn}
        />
      )}

      {/* Main Content Area Based on Phase */}
      {roomState.phase === 'VOTING' ? (
        <VotingPanel
          players={roomState.players}
          myPlayerId={myPlayerId}
          votingMode={roomState.settings.votingMode}
          onCastVote={onCastVote}
        />
      ) : (roomState.phase === 'FINAL_SIMULATION' || roomState.phase === 'GAME_OVER') && roomState.simulationResult ? (
        <SimulationView
          simulation={roomState.simulationResult}
          onPlayAgain={isHost ? onPlayAgain : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Players Carousel / List (Left Column on Desktop, Horizontal bar on mobile) */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between px-1">
              <span>Ishtirokchilar</span>
              <span className="text-emerald-400">{Object.values(roomState.players).filter(p => p.isAlive).length} tirik</span>
            </h3>

            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 pr-1">
              {roomState.playerOrder.map((pid) => {
                const player = roomState.players[pid];
                if (!player) return null;

                const isSelected = selectedPlayerId === pid;
                const isSpeaker = roomState.activeSpeakerPlayerId === pid;
                const isMe = pid === myPlayerId;
                const revealedCardsCount = Object.values(player.cards).filter(c => c.isRevealed).length;

                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => { sound.playClick(); setSelectedPlayerId(pid); }}
                    className={`min-w-[150px] lg:min-w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                      !player.isAlive
                        ? 'opacity-40 bg-bunker-950 border-slate-900 line-through'
                        : isSelected
                          ? 'bg-bunker-850 border-hazard-orange shadow-hazard-sm scale-[1.01]'
                          : isSpeaker
                            ? 'bg-amber-950/40 border-amber-500/70 animate-pulse'
                            : 'bg-bunker-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-bunker-950 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {player.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs text-slate-100 truncate block">
                            {player.displayName}
                          </span>
                          {isMe && <span className="text-[9px] text-cyan-400 font-mono">(Siz)</span>}
                        </div>
                        <span className="text-[10px] text-amber-400/90 truncate block">
                          {player.cards.profession?.isRevealed ? player.cards.profession.card.title : 'Kasbi yashirin'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!player.isAlive ? (
                        <Skull size={14} className="text-red-500" />
                      ) : isSpeaker ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          {revealedCardsCount}/7
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Area: Character Cards Sheet (3 Columns of Cards) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bunker-950 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200">
                  {targetPlayer.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-100">
                      {targetPlayer.displayName}
                    </h2>
                    {targetPlayer.id === myPlayerId && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold">
                        SIZNING PROFILINGIZ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {targetPlayer.isAlive ? '🟢 Boshpanaga da\'vogar (Tirik)' : '🔴 Chiqarib yuborilgan (Halok bo\'ldi)'}
                  </p>
                </div>
              </div>

              {/* Turn Banner if it's my turn */}
              {isMyTurn && roomState.phase === 'ROUND_PITCH' && targetPlayer.id === myPlayerId && (
                <div className="px-3 py-1.5 rounded-xl bg-hazard-orange/20 border border-hazard-orange text-hazard-orange text-xs font-bold font-mono animate-pulse">
                  ⚡ KARTANGIZNI TANLANG VA OCHING!
                </div>
              )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {(['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'] as CardCategory[]).map((cat) => {
                const slot = targetPlayer.cards[cat];
                if (!slot) return null;

                const isOwner = targetPlayer.id === myPlayerId;
                
                // Can reveal rule:
                // If it's my turn in ROUND_PITCH and card is not revealed:
                // - In Round 1: ONLY profession can be revealed.
                // - In Round 2+: ANY unrevealed card can be revealed by player's choice!
                const canReveal = isOwner && isMyTurn && roomState.phase === 'ROUND_PITCH' && !slot.isRevealed && (
                  isRound1 ? cat === 'profession' : true
                );

                return (
                  <CharacterCard
                    key={cat}
                    category={cat}
                    card={slot.card}
                    isRevealed={slot.isRevealed}
                    isOwner={isOwner}
                    canReveal={canReveal}
                    onReveal={() => onRevealCard(cat)}
                    onUseSpecial={cat === 'special' ? onUseSpecial : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Reactions / Chat Drawer */}
      <div className="fixed bottom-3 inset-x-0 max-w-xl mx-auto px-4 z-40">
        <div className="bg-bunker-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 shadow-2xl space-y-2">
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto px-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleQuickReaction(emoji)}
                className="w-8 h-8 rounded-lg bg-bunker-950 hover:bg-bunker-800 text-sm flex items-center justify-center transition-transform active:scale-125 flex-shrink-0"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          {isChatOpen && (
            <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <input
                type="text"
                maxLength={100}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tezkor xabar yozish..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-bunker-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-hazard-orange"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-hazard-orange hover:bg-hazard-orangeDark text-white transition-colors"
              >
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Disaster Modal */}
      {showDisasterModal && roomState.catastrophe && roomState.shelterSpecs && (
        <DisasterModal
          catastrophe={roomState.catastrophe}
          shelterSpecs={roomState.shelterSpecs}
          onClose={() => setShowDisasterModal(false)}
          isHost={!!isHost && roomState.phase === 'DISASTER_INTRO'}
          onStartRounds={onStartRounds}
        />
      )}
    </div>
  );
};
