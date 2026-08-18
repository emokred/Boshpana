import React, { useState } from 'react';
import { GameRoomState, CardCategory } from '@boshpana/shared';
import { 
  AlertTriangle, Users, MessageSquare, Shield, Skull, 
  LogOut, Volume2, VolumeX, Send, X, AlertCircle
} from 'lucide-react';
import { CharacterCard } from '../card/CharacterCard';
import { TimerBar } from './TimerBar';
import { VotingPanel } from './VotingPanel';
import { SimulationView } from './SimulationView';
import { DisasterModal } from './DisasterModal';
import { sound } from '../../services/sound';

interface FloatingReaction {
  id: string;
  emoji: string;
  leftPercent: number;
}

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
  onSkipPhase: () => void;
  onStartRounds: () => void;
  onPlayAgain: () => void;
  onLeaveGame: () => void;
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
  onSkipPhase,
  onStartRounds,
  onPlayAgain,
  onLeaveGame
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(myPlayerId);
  const [showDisasterModal, setShowDisasterModal] = useState<boolean>(roomState.phase === 'DISASTER_INTRO');
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

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

  const spawnReaction = (emoji: string) => {
    sound.playClick();
    onSendChatMessage(emoji);

    const newReaction: FloatingReaction = {
      id: Math.random().toString(),
      emoji,
      leftPercent: 15 + Math.random() * 70
    };

    setFloatingReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  // Determine what phase label to show
  let phaseLabel = 'APOKALIPSIS';
  if (roomState.phase === 'DISASTER_INTRO') phaseLabel = 'FALOKAT E\'LONI';
  else if (roomState.phase === 'ROUND_PITCH') phaseLabel = `${roomState.roundNumber}-RAUND: KARTA OCHISH (PITCH)`;
  else if (roomState.phase === 'ROUND_DEBATE') phaseLabel = 'UMUMIY BAHS (MUHOKAMA)';
  else if (roomState.phase === 'VOTING') phaseLabel = 'OVOZ BERISH';
  else if (roomState.phase === 'VOTE_RESULTS') phaseLabel = 'RAUND NATIJASI';
  else if (roomState.phase === 'FINAL_SIMULATION') phaseLabel = 'BOSHPANA TAQDIRI';
  else if (roomState.phase === 'GAME_OVER') phaseLabel = 'O\'YIN TUGADI';

  const isRound1 = roomState.roundNumber === 1;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn pb-28 relative">
      
      {/* Floating Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-20 text-3xl sm:text-4xl animate-float-up"
            style={{ left: `${r.leftPercent}%` }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

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
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>

          {/* Chat Toggle */}
          <button
            type="button"
            onClick={() => { sound.playClick(); setIsChatOpen(!isChatOpen); }}
            className={`p-2 rounded-xl border transition-colors relative ${
              isChatOpen 
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300' 
                : 'bg-bunker-950 hover:bg-bunker-800 text-slate-300 border-slate-800'
            }`}
            title="Chatni ochish"
          >
            <MessageSquare size={16} />
            {roomState.chatMessages.length > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-hazard-orange rounded-full" />
            )}
          </button>

          {/* Leave Game Button */}
          <button
            type="button"
            onClick={() => { sound.playClick(); setShowExitConfirm(true); }}
            className="p-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-400 border border-red-800/80 transition-colors"
            title="O'yindan chiqish"
          >
            <LogOut size={16} />
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
          onSkipPhase={onSkipPhase}
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
          
          {/* Players Carousel / List (Left Column) */}
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

          {/* Main Area: Character Cards Sheet */}
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

      {/* Floating Reactions Bar */}
      <div className="fixed bottom-3 inset-x-0 max-w-xl mx-auto px-4 z-40">
        <div className="bg-bunker-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl space-y-2">
          
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto px-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => spawnReaction(emoji)}
                className="w-9 h-9 rounded-xl bg-bunker-950 hover:bg-bunker-800 text-lg flex items-center justify-center transition-transform active:scale-125 flex-shrink-0 border border-slate-800 hover:border-hazard-orange/50"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Expandable Chat Drawer */}
          {isChatOpen && (
            <div className="pt-2 border-t border-slate-800 space-y-2 animate-fadeIn">
              {/* Message List */}
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {roomState.chatMessages.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-2">Xabarlar yo'q...</p>
                ) : (
                  roomState.chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-xl text-xs ${
                        msg.isSystem
                          ? 'bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono'
                          : msg.senderId === myPlayerId
                            ? 'bg-hazard-orange/20 border border-hazard-orange/40 text-slate-100 ml-6'
                            : 'bg-bunker-950 border border-slate-800 text-slate-200 mr-6'
                      }`}
                    >
                      {!msg.isSystem && (
                        <span className="font-bold text-[10px] text-slate-400 block">
                          {msg.senderName}
                        </span>
                      )}
                      <span>{msg.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={120}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Xabar yozing..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-bunker-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-hazard-orange"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-hazard-orange hover:bg-hazard-orangeDark text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Exit Game Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bunker-900 border-2 border-red-500 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle size={26} />
            </div>

            <h3 className="text-base font-black text-slate-100 uppercase">
              O'yindan Chiqish
            </h3>

            <p className="text-xs text-slate-300">
              Haqiqatan ham boshpanani tark etmoqchimisiz? Joriy o'yin jarayoni to'xtatiladi.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-300 text-xs font-bold"
              >
                Bekor Qilish
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onLeaveGame();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Ha, Chiqish
              </button>
            </div>
          </div>
        </div>
      )}

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
