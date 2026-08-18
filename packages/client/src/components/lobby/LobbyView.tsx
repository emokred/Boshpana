import React, { useState } from 'react';
import { GameRoomState, DeckTheme, RoomSettings, CardCategory } from '@boshpana/shared';
import { CARDS_DATA, CATASTROPHES } from '@boshpana/shared';
import { 
  Users, Copy, Check, Play, Settings, Shield, Sparkles, 
  Flame, Lock, Eye, CheckCircle2, Circle, AlertCircle, Share2,
  BookOpen, X, Layers, Plus, Minus, ToggleLeft, ToggleRight, UserPlus
} from 'lucide-react';
import { sound } from '../../services/sound';

interface LobbyViewProps {
  roomState: GameRoomState;
  myPlayerId: string;
  onUpdateSettings?: (settings: Partial<RoomSettings>) => void;
  onToggleCardExclusion?: (cardId: string) => void;
  onAddDemoBot?: () => void;
  onRemoveDemoBot?: (botId: string) => void;
  onSetReady: (isReady: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom?: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomState,
  myPlayerId,
  onUpdateSettings,
  onToggleCardExclusion,
  onAddDemoBot,
  onRemoveDemoBot,
  onSetReady,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeckBrowser, setShowDeckBrowser] = useState(false);
  const [deckTab, setDeckTab] = useState<CardCategory | 'catastrophes'>('profession');

  const myPlayer = roomState.players[myPlayerId];
  const isHost = myPlayer?.isHost;
  const playersList = Object.values(roomState.players);
  const readyCount = playersList.filter((p) => p.isReady).length;
  const canStart = playersList.length >= 4; // 4 to 16 players

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
      if (current.length === 1) return;
      updated = current.filter((d) => d !== theme);
    } else {
      updated = [...current, theme];
    }
    onUpdateSettings({ selectedDecks: updated });
  };

  // Filter cards based on active selected decks
  const activeCards = CARDS_DATA.filter((c) =>
    roomState.settings.selectedDecks.includes(c.theme)
  );
  const activeCatastrophes = CATASTROPHES.filter((c) =>
    roomState.settings.selectedDecks.includes(c.theme)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-3 sm:p-4 animate-fadeIn pb-24">
      {/* Top Header Card: Room Code & Share */}
      <div className="bg-bunker-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 shadow-hazard-sm flex flex-col sm:flex-row items-center justify-between gap-3">
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
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Share2 size={14} className="text-cyan-400" />
            <span>Ulashish</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setShowDeckBrowser(true); }}
            className="px-3 py-2 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Kartalarni ko'rish va sozlash"
          >
            <Layers size={14} className="text-amber-400" />
            <span>Kartalar ({activeCards.length - (roomState.settings.excludedCardIds?.length || 0)})</span>
          </button>

          {onLeaveRoom && (
            <button
              type="button"
              onClick={onLeaveRoom}
              className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/60 text-xs font-medium transition-colors"
            >
              Chiqish
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left = Players, Right = Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Players List */}
        <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                O'yinchilar ({playersList.length}/{roomState.settings.maxPlayers})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Tayyor: <span className="text-emerald-400 font-bold">{readyCount}</span>/{playersList.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {playersList.map((player) => {
              const isMe = player.id === myPlayerId;
              const isBot = player.id.startsWith('player-bot-');

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isMe
                      ? 'bg-bunker-850 border-hazard-orange/50 shadow-hazard-sm'
                      : 'bg-bunker-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-bunker-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 flex-shrink-0">
                      {player.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-100 truncate">
                          {player.displayName}
                        </span>
                        {player.isHost && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                            HOST
                          </span>
                        )}
                        {isMe && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                            SIZ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {player.isReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                        <CheckCircle2 size={11} /> Tayyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                        <Circle size={9} /> Kutmoqda
                      </span>
                    )}

                    {isHost && isBot && onRemoveDemoBot && (
                      <button
                        type="button"
                        onClick={() => onRemoveDemoBot(player.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Botni o'chirish"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Bot & Ready Button */}
          <div className="pt-2 space-y-2">
            {isHost && onAddDemoBot && playersList.length < roomState.settings.maxPlayers && (
              <button
                type="button"
                onClick={onAddDemoBot}
                className="w-full py-2 px-3 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-cyan-300 border border-cyan-700/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus size={13} />
                <span>+ Demo Bot Qo'shish (Test uchun)</span>
              </button>
            )}

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
        <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Settings size={16} className="text-hazard-orange" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              O'yin Sozlamalari {isHost ? '(Host)' : ''}
            </h3>
          </div>

          {/* Voting Mode */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
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

          {/* Player Capacity (4 to 16) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              Maksimal O'yinchilar Soni (4 - 16):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 6, 8, 12, 16].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={!isHost}
                  onClick={() => isHost && onUpdateSettings?.({ maxPlayers: count })}
                  className={`p-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    roomState.settings.maxPlayers === count
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-bunker-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {count} kishi
                </button>
              ))}
            </div>
          </div>

          {/* Target Survivors */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              Bunkerda qoluvchilar soni (G'oliblar):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={!isHost}
                  onClick={() => isHost && onUpdateSettings?.({ targetSurvivors: count })}
                  className={`p-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
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
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block">
              Faol To'plamlar:
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
                  {roomState.settings.selectedDecks.includes('classic') ? '✓ Faol' : ''}
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
                  {roomState.settings.selectedDecks.includes('uzbek') ? '✓ Faol' : ''}
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
                  {roomState.settings.selectedDecks.includes('nsfw18') ? '✓ Faol' : ''}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deck Browser & Custom Card Toggle Modal */}
      {showDeckBrowser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bunker-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-amber-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-100 uppercase">
                    Kartalar Ro'yxati va Sozlamasi
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isHost ? 'Host kartalarni o\'yin uchun yoqishi yoki o\'chirishi mumkin' : 'Mavjud kartalar ro\'yxati'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeckBrowser(false)}
                className="p-1.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Sub-tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-shrink-0 text-xs">
              {[
                { id: 'profession', label: 'Kasblar' },
                { id: 'biology', label: 'Biologiya' },
                { id: 'health', label: 'Salomatlik' },
                { id: 'baggage', label: 'Bagaj' },
                { id: 'hobby', label: 'Xobbi' },
                { id: 'fact', label: 'Faktlar' },
                { id: 'special', label: 'Maxsus' },
                { id: 'catastrophes', label: 'Falokatlar' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDeckTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-mono font-bold whitespace-nowrap transition-colors ${
                    deckTab === tab.id
                      ? 'bg-hazard-orange text-white'
                      : 'bg-bunker-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Cards Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {deckTab === 'catastrophes' ? (
                activeCatastrophes.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-bunker-950 border border-slate-800 space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-hazard-orange">{c.title}</h4>
                    <p className="text-xs text-slate-300">{c.shortDesc}</p>
                    <div className="flex gap-1 pt-1 flex-wrap">
                      {c.hazards.map((h, i) => (
                        <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                activeCards
                  .filter((c) => c.category === deckTab)
                  .map((card) => {
                    const isExcluded = roomState.settings.excludedCardIds?.includes(card.id);

                    return (
                      <div
                        key={card.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                          isExcluded
                            ? 'bg-bunker-950/40 border-slate-900 opacity-50'
                            : 'bg-bunker-950 border-slate-800'
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs sm:text-sm ${isExcluded ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                              {card.title}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-bunker-900 text-slate-400 border border-slate-800">
                              {card.theme.toUpperCase()}
                            </span>
                          </div>
                          {card.description && (
                            <p className="text-xs text-slate-400">{card.description}</p>
                          )}
                        </div>

                        {/* Host Card Toggle (+ / -) */}
                        {isHost && onToggleCardExclusion && (
                          <button
                            type="button"
                            onClick={() => onToggleCardExclusion(card.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                              isExcluded
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {isExcluded ? <Plus size={13} /> : <Minus size={13} />}
                            <span>{isExcluded ? 'Qo\'shish' : 'O\'chirish'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowDeckBrowser(false)}
              className="w-full py-2.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-200 text-xs font-bold uppercase flex-shrink-0"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Start Game Action for Host */}
      {isHost && (
        <div className="pt-2">
          {!canStart && (
            <p className="text-xs text-yellow-400 text-center mb-2 flex items-center justify-center gap-1.5 font-mono">
              <AlertCircle size={14} />
              <span>O'yinni boshlash uchun kamida 4 nafar o'yinchi kerak (yoki demo bot qo'shing)</span>
            </p>
          )}

          <button
            type="button"
            disabled={!canStart}
            onClick={() => {
              sound.playAlarm();
              onStartGame();
            }}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-2 shadow-hazard-lg transition-all ${
              canStart
                ? 'bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white active:scale-98 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play size={18} />
            <span>O'yinni Boshlash ({playersList.length} o'yinchi)</span>
          </button>
        </div>
      )}
    </div>
  );
};
