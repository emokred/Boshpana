import React, { useState } from 'react';
import { GameRoomState, DeckTheme, RoomSettings, VotingMode } from '@boshpana/shared';
import { 
  Users, Copy, Check, Play, Settings, Shield, Sparkles, 
  Flame, Lock, Eye, CheckCircle2, Circle, AlertCircle, Share2
} from 'lucide-react';
import { sound } from '../../services/sound';

interface LobbyViewProps {
  roomState: GameRoomState;
  myPlayerId: string;
  onUpdateSettings?: (settings: Partial<RoomSettings>) => void;
  onSetReady: (isReady: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom?: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomState,
  myPlayerId,
  onUpdateSettings,
  onSetReady,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);
  const myPlayer = roomState.players[myPlayerId];
  const isHost = myPlayer?.isHost;
  const playersList = Object.values(roomState.players);
  const readyCount = playersList.filter((p) => p.isReady).length;
  const canStart = playersList.length >= 3; // Min 3 players for good bunker game

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    sound.playClick();
    const url = `${window.location.origin}?room=${roomState.roomCode}`;
    if (navigator.share) {
      navigator.share({
        title: "Boshpana o'yiniga qo'shiling!",
        text: `Boshpana (Bunker) o'yinimizga kiring! Xona kodi: ${roomState.roomCode}`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleDeck = (theme: DeckTheme) => {
    if (!isHost || !onUpdateSettings) return;
    sound.playClick();
    const current = roomState.settings.selectedDecks || ['classic'];
    let updated: DeckTheme[];
    if (current.includes(theme)) {
      if (current.length === 1) return; // Must have at least 1 deck
      updated = current.filter((d) => d !== theme);
    } else {
      updated = [...current, theme];
    }
    onUpdateSettings({ selectedDecks: updated });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 p-4 animate-fadeIn">
      {/* Top Header Card: Room Code & Share */}
      <div className="bg-bunker-900 border-2 border-slate-800 rounded-2xl p-5 shadow-hazard-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Xona Kodi (Room Code)
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-hazard-orange tracking-widest">
              #{roomState.roomCode}
            </h2>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-bunker-800 hover:bg-bunker-700 text-slate-300 transition-colors"
              title="Kodni nusxalash"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleShareLink}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Share2 size={15} className="text-cyan-400" />
            <span>Havolani Ulashish</span>
          </button>

          {onLeaveRoom && (
            <button
              type="button"
              onClick={onLeaveRoom}
              className="px-3 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/60 text-xs font-medium transition-colors"
            >
              Chiqish
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left = Players, Right = Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Players List */}
        <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                O'yinchilar ({playersList.length}/{roomState.settings.maxPlayers})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Tayyor: <span className="text-emerald-400 font-bold">{readyCount}</span>/{playersList.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {playersList.map((player) => {
              const isMe = player.id === myPlayerId;
              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isMe
                      ? 'bg-bunker-850 border-hazard-orange/50 shadow-hazard-sm'
                      : 'bg-bunker-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-bunker-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 flex-shrink-0">
                      {player.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-100 truncate">
                          {player.displayName}
                        </span>
                        {player.isHost && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                            HOST
                          </span>
                        )}
                        {isMe && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                            SIZ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {player.username ? `@${player.username}` : 'O\'yinchi'}
                      </span>
                    </div>
                  </div>

                  <div>
                    {player.isReady ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                        <CheckCircle2 size={12} /> Tayyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                        <Circle size={10} /> Kutmoqda
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ready Button for non-host or Host */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSetReady(!myPlayer?.isReady);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all active:scale-98 ${
                myPlayer?.isReady
                  ? 'bg-bunker-800 border-slate-700 text-slate-300 hover:bg-bunker-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md'
              }`}
            >
              {myPlayer?.isReady ? <Circle size={14} /> : <CheckCircle2 size={14} />}
              <span>{myPlayer?.isReady ? 'Tayyorgarlikni Bekor Qilish' : 'Men Tayyorman!'}</span>
            </button>
          </div>
        </div>

        {/* Host Settings & Deck Configurations */}
        <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Settings size={18} className="text-hazard-orange" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              O'yin Sozlamalari {isHost ? '(Host)' : ''}
            </h3>
          </div>

          {/* Voting Mode: Open vs Secret */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">
              Ovoz Berish Rejimi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!isHost}
                onClick={() => isHost && onUpdateSettings?.({ votingMode: 'open' })}
                className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                  roomState.settings.votingMode === 'open'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-bunker-950 border-slate-800 text-slate-400'
                }`}
              >
                <Eye size={13} />
                <span>Ochiq Ovoz</span>
              </button>

              <button
                type="button"
                disabled={!isHost}
                onClick={() => isHost && onUpdateSettings?.({ votingMode: 'secret' })}
                className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                  roomState.settings.votingMode === 'secret'
                    ? 'bg-yellow-950/80 border-yellow-500 text-yellow-300 shadow-sm'
                    : 'bg-bunker-950 border-slate-800 text-slate-400'
                }`}
              >
                <Lock size={13} />
                <span>Anonim Ovoz</span>
              </button>
            </div>
          </div>

          {/* Final Simulation Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">
              Final Boshpana Simulyatsiyasi:
            </label>
            <button
              type="button"
              disabled={!isHost}
              onClick={() => isHost && onUpdateSettings?.({ finalSimulation: !roomState.settings.finalSimulation })}
              className={`w-full p-2 rounded-xl text-xs font-bold border flex items-center justify-between px-3 transition-colors ${
                roomState.settings.finalSimulation
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                  : 'bg-bunker-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>Omon Qolish Hisobi (AI/Algoritm)</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bunker-950 border border-current">
                {roomState.settings.finalSimulation ? 'YOQILGAN' : 'O\'CHIRILGAN'}
              </span>
            </button>
          </div>

          {/* Target Survivors */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">
              Bunkerda qoluvchilar soni (G'oliblar):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={!isHost}
                  onClick={() => isHost && onUpdateSettings?.({ targetSurvivors: count })}
                  className={`p-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    roomState.settings.targetSurvivors === count
                      ? 'bg-hazard-orange border-hazard-orange text-white'
                      : 'bg-bunker-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {count} kishi
                </button>
              ))}
            </div>
          </div>

          {/* Decks Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">
              Kartalar To'plami:
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                disabled={!isHost}
                onClick={() => toggleDeck('classic')}
                className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center justify-between px-3 transition-colors ${
                  roomState.settings.selectedDecks.includes('classic')
                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                    : 'bg-bunker-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shield size={13} className="text-cyan-400" />
                  <span>🟢 Klassik Apokalipsis</span>
                </div>
                <span className="text-[10px] font-mono">
                  {roomState.settings.selectedDecks.includes('classic') ? '✓ Tanlangan' : ''}
                </span>
              </button>

              <button
                type="button"
                disabled={!isHost}
                onClick={() => toggleDeck('uzbek')}
                className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center justify-between px-3 transition-colors ${
                  roomState.settings.selectedDecks.includes('uzbek')
                    ? 'bg-amber-950/60 border-amber-600/70 text-amber-200'
                    : 'bg-bunker-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>🏛️ O'zbekona Kolorit (Memlar)</span>
                </div>
                <span className="text-[10px] font-mono">
                  {roomState.settings.selectedDecks.includes('uzbek') ? '✓ Tanlangan' : ''}
                </span>
              </button>

              <button
                type="button"
                disabled={!isHost}
                onClick={() => toggleDeck('nsfw18')}
                className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center justify-between px-3 transition-colors ${
                  roomState.settings.selectedDecks.includes('nsfw18')
                    ? 'bg-red-950/60 border-red-600/70 text-red-200'
                    : 'bg-bunker-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Flame size={13} className="text-red-400" />
                  <span>🔴 18+ Qora Yumor (Kattalar)</span>
                </div>
                <span className="text-[10px] font-mono">
                  {roomState.settings.selectedDecks.includes('nsfw18') ? '✓ Tanlangan' : ''}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Game Action for Host */}
      {isHost && (
        <div className="pt-2">
          {!canStart && (
            <p className="text-xs text-yellow-400 text-center mb-2 flex items-center justify-center gap-1.5 font-mono">
              <AlertCircle size={14} />
              <span>O'yinni boshlash uchun kamida 3 nafar o'yinchi kerak</span>
            </p>
          )}

          <button
            type="button"
            disabled={!canStart}
            onClick={() => {
              sound.playAlarm();
              onStartGame();
            }}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-2 shadow-hazard-lg transition-all ${
              canStart
                ? 'bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white active:scale-98 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play size={20} />
            <span>O'yinni Boshlash (Apokalipsis)</span>
          </button>
        </div>
      )}
    </div>
  );
};
