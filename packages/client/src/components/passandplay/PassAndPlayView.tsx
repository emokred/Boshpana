import React, { useState, useEffect } from 'react';
import { 
  CARDS_DATA, CATASTROPHES, SHELTER_SPECS_PRESETS, BUNKER_EVENTS,
  CardCategory, CardItem, PlayerCardSlot, Catastrophe, ShelterSpecs, BunkerEvent
} from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { EliminationRevealModal } from '../game/EliminationRevealModal';
import { 
  Smartphone, Users, Play, ArrowRight, Eye, EyeOff, 
  RotateCcw, Skull, Trophy, AlertTriangle, Shield, Check, Flame,
  Pause, Play as PlayIcon, Plus, SkipForward, Clock, LayoutGrid
} from 'lucide-react';
import { sound } from '../../services/sound';

interface OfflinePlayer {
  id: string;
  name: string;
  isAlive: boolean;
  cards: Record<CardCategory, PlayerCardSlot>;
}

export const PassAndPlayView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  // Game Steps
  const [step, setStep] = useState<
    'SETUP' | 'SECRET_PEEK' | 'DISASTER_INTRO' | 'PITCH_SELECTION' | 'PITCH_SPEAKING' | 'TABLE_DEBATE' | 'VOTING' | 'ELIMINATION_REVEAL' | 'EVENT' | 'FINAL_RESULT'
  >('SETUP');

  const [playerNames, setPlayerNames] = useState<string[]>(['Ali', 'Vali', 'Guli', 'Sami']);
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const [isHardcoreSimulation, setIsHardcoreSimulation] = useState(true);
  
  // Game state
  const [players, setPlayers] = useState<OfflinePlayer[]>([]);
  const [lastEliminatedOfflinePlayer, setLastEliminatedOfflinePlayer] = useState<OfflinePlayer | null>(null);
  const [currentTurnPlayerIndex, setCurrentTurnPlayerIndex] = useState(0);
  const [selectedCardToReveal, setSelectedCardToReveal] = useState<CardCategory | null>(null);
  const [isSecretPeekRevealed, setIsSecretPeekRevealed] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [catastrophe, setCatastrophe] = useState<Catastrophe | null>(null);
  const [shelter, setShelter] = useState<ShelterSpecs | null>(null);
  const [currentEvent, setCurrentEvent] = useState<BunkerEvent | null>(null);
  const [survivorCount, setSurvivorCount] = useState(2);

  // Pitch Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Setup: Add Player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerInput.trim() && playerNames.length < 16) {
      sound.playClick();
      setPlayerNames([...playerNames, newPlayerInput.trim()]);
      setNewPlayerInput('');
    }
  };

  const handleRemovePlayer = (idx: number) => {
    sound.playClick();
    setPlayerNames(playerNames.filter((_, i) => i !== idx));
  };

  // Start Pass and Play
  const handleStartGame = () => {
    if (playerNames.length < 3) return;
    sound.playAlarm();

    const cat = CATASTROPHES[Math.floor(Math.random() * CATASTROPHES.length)];
    const sh = SHELTER_SPECS_PRESETS[Math.floor(Math.random() * SHELTER_SPECS_PRESETS.length)];
    setCatastrophe(cat);
    setShelter(sh);

    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

    const newPlayers: OfflinePlayer[] = playerNames.map((name, pIdx) => {
      const cards: Record<CardCategory, PlayerCardSlot> = {} as any;
      categories.forEach((catKey) => {
        const catCards = CARDS_DATA.filter((c) => c.category === catKey);
        const card = catCards[Math.floor(Math.random() * catCards.length)] || CARDS_DATA[0];
        cards[catKey] = {
          category: catKey,
          card,
          isRevealed: false
        };
      });

      return {
        id: `offline_p_${pIdx}`,
        name,
        isAlive: true,
        cards
      };
    });

    setPlayers(newPlayers);
    setCurrentTurnPlayerIndex(0);
    setIsSecretPeekRevealed(false);
    setRoundNumber(1);
    setStep('SECRET_PEEK');
  };

  // Secret Peek Progression
  const handleNextSecretPeek = () => {
    sound.playClick();
    setIsSecretPeekRevealed(false);
    if (currentTurnPlayerIndex + 1 < players.length) {
      setCurrentTurnPlayerIndex(currentTurnPlayerIndex + 1);
    } else {
      // Everyone saw their secret cards -> Show Disaster Intro
      sound.playGong();
      setCurrentTurnPlayerIndex(0);
      setStep('DISASTER_INTRO');
    }
  };

  // Start Pitching in Round
  const handleStartRoundsFromIntro = () => {
    sound.playClick();
    setCurrentTurnPlayerIndex(0);
    startPlayerTurn(0);
  };

  const startPlayerTurn = (playerIndex: number) => {
    const alivePlayers = players.filter((p) => p.isAlive);
    if (playerIndex >= alivePlayers.length) {
      // All alive players finished pitching -> Move to Table Debate!
      sound.playVoteGong();
      setStep('TABLE_DEBATE');
      return;
    }

    const currentPlayer = alivePlayers[playerIndex];
    const fullPlayerIndex = players.findIndex((p) => p.id === currentPlayer.id);
    setCurrentTurnPlayerIndex(fullPlayerIndex);

    if (roundNumber === 1) {
      // Round 1 is strictly Profession
      setSelectedCardToReveal('profession');
      startSpeaking('profession', fullPlayerIndex);
    } else {
      // Round 2+ Player chooses ANY unrevealed card to pitch!
      setSelectedCardToReveal(null);
      setStep('PITCH_SELECTION');
    }
  };

  const startSpeaking = (category: CardCategory, playerIdx: number) => {
    sound.playCardFlip();
    const updated = [...players];
    const player = updated[playerIdx];
    if (player && player.cards[category]) {
      player.cards[category].isRevealed = true;
      player.cards[category].revealedAtRound = roundNumber;
      setPlayers(updated);
    }

    setSelectedCardToReveal(category);
    setTimerSeconds(60);
    setIsTimerPaused(false);
    setStep('PITCH_SPEAKING');
  };

  // Timer Tick during Pitch Speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'PITCH_SPEAKING' && !isTimerPaused && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 10 && prev > 1) {
            sound.playGeiger();
          }
          if (prev <= 1) {
            sound.playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isTimerPaused, timerSeconds]);

  // Finish current player's pitch and pass to next
  const handleFinishPlayerPitch = () => {
    sound.playClick();
    const alivePlayers = players.filter((p) => p.isAlive);
    const currentAliveIndex = alivePlayers.findIndex((p) => p.id === players[currentTurnPlayerIndex]?.id);
    startPlayerTurn(currentAliveIndex + 1);
  };

  // Eliminate player in voting
  const handleEliminatePlayer = (playerId: string) => {
    sound.playElimination();
    const victim = players.find(p => p.id === playerId);
    if (victim) {
      // Reveal all cards of the victim
      Object.keys(victim.cards).forEach(k => {
        victim.cards[k as CardCategory].isRevealed = true;
      });
      setLastEliminatedOfflinePlayer({ ...victim, isAlive: false });
    }

    const updated = players.map((p) => p.id === playerId ? { ...p, isAlive: false } : p);
    setPlayers(updated);
    setStep('ELIMINATION_REVEAL');
  };

  const handleContinueFromElimination = () => {
    sound.playClick();
    const aliveCount = players.filter((p) => p.isAlive).length;
    if (aliveCount <= survivorCount) {
      sound.playVictory();
      setStep('FINAL_RESULT');
    } else {
      // Trigger Bunker Event
      const ev = BUNKER_EVENTS[Math.floor(Math.random() * BUNKER_EVENTS.length)];
      setCurrentEvent(ev);
      sound.playEventDiscovery();
      setStep('EVENT');
    }
  };

  const handleNextRoundFromEvent = () => {
    sound.playClick();
    setRoundNumber(roundNumber + 1);
    setCurrentTurnPlayerIndex(0);
    startPlayerTurn(0);
  };

  const currentPlayer = players[currentTurnPlayerIndex];

  return (
    <div className="min-h-screen bg-bunker-950 text-slate-100 p-4 max-w-xl mx-auto flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-hazard-orange/20 text-hazard-orange">
            <Smartphone size={18} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-hazard-orange">
              📱 Bitta Telefon Rejimi (Qo'lma-qo'l)
            </h2>
            <p className="text-[10px] text-slate-400">
              {step === 'SETUP' ? 'O\'yinchilar sozlamasi' : `${roundNumber}-Raund | ${players.filter(p => p.isAlive).length} kishi qoldi`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          Chiqish
        </button>
      </div>

      {/* ================= 1. SETUP PLAYERS ================= */}
      {step === 'SETUP' && (
        <div className="py-6 space-y-5 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-300">👥 O'yinchilar Ro'yxati ({playerNames.length}/16):</h3>
            
            <form onSubmit={handleAddPlayer} className="flex gap-2">
              <input
                type="text"
                value={newPlayerInput}
                onChange={(e) => setNewPlayerInput(e.target.value)}
                placeholder="O'yinchi ismini yozing..."
                className="flex-1 px-3 py-2 rounded-xl bg-bunker-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-hazard-orange"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-hazard-orange hover:bg-hazard-orangeDark text-white font-bold text-xs"
              >
                + Qo'shish
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {playerNames.map((name, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700"
                >
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(i)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Omon Qoluvchilar Soni:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSurvivorCount(num)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs ${
                    survivorCount === num ? 'bg-hazard-orange text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            disabled={playerNames.length < 3}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white font-black text-sm uppercase tracking-wider shadow-hazard-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play size={16} />
            <span>O'yinni Boshlash ({playerNames.length} kishi)</span>
          </button>
        </div>
      )}

      {/* ================= 2. SECRET PEEK PHASE ================= */}
      {step === 'SECRET_PEEK' && (
        <div className="py-6 space-y-6 text-center animate-fadeIn">
          {!isSecretPeekRevealed ? (
            <div className="p-8 rounded-3xl bg-bunker-900 border-2 border-hazard-orange/50 space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-hazard-orange/20 border-2 border-hazard-orange flex items-center justify-center text-hazard-orange mx-auto animate-bounce">
                <Smartphone size={32} />
              </div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest">Maxfiy ko'rish navbati:</h3>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                📱 Telefonni <span className="text-hazard-orange">{currentPlayer?.name}</span> ga bering!
              </h2>
              <p className="text-xs text-slate-400">
                Boshqalar qaramay tursin. O'z kartalaringizni eslab qolish uchun pastdagi tugmani bosing.
              </p>

              <button
                type="button"
                onClick={() => {
                  sound.playPeek();
                  setIsSecretPeekRevealed(true);
                }}
                className="w-full py-3.5 rounded-xl bg-hazard-orange text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
              >
                👁️ Kartalarimni Ko'rish
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-bunker-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-hazard-orange">
                  👤 {currentPlayer?.name} ning Maxfiy Kartalari:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentTurnPlayerIndex + 1} / {players.length}
                </span>
              </div>

              {/* Player Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[52vh] overflow-y-auto p-1">
                {Object.entries(currentPlayer?.cards || {}).map(([catKey, slot]) => (
                  <div key={catKey}>
                    <CharacterCard
                      category={catKey as CardCategory}
                      card={slot.card}
                      isRevealed={true}
                      isOwner={true}
                      canReveal={false}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextSecretPeek}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Yopish va Telefonni Keyingisiga Berish</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. DISASTER INTRO POSTER ================= */}
      {step === 'DISASTER_INTRO' && (
        <div className="py-4 space-y-4 text-center animate-fadeIn">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-red-950 to-bunker-900 border-2 border-red-600 space-y-3 shadow-2xl">
            <span className="text-4xl animate-pulse">🚨</span>
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-red-400">
              GLOBAL FALOKAT YUZ BERDI!
            </h3>
            <h2 className="text-2xl font-black text-white uppercase">{catastrophe?.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{catastrophe?.shortDesc}</p>
            
            <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800 text-left text-xs space-y-1.5 mt-2">
              <div>🏛 <b>Boshpana:</b> Maydoni {shelter?.areaSqMeters} kv.m, {catastrophe?.shelterMonths} oylik resurs.</div>
              <div>⚠️ <b>Xavflar:</b> {catastrophe?.hazards.join(', ')}</div>
              <div>🎯 <b>Omon qoluvchilar kvotasi:</b> {survivorCount} nafar mutaxassis!</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartRoundsFromIntro}
            className="w-full py-3.5 rounded-2xl bg-hazard-orange hover:bg-hazard-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-hazard-lg animate-pulse"
          >
            1-Raundni Boshlash (Kasblar Jangi) ➡️
          </button>
        </div>
      )}

      {/* ================= 4. PITCH SELECTION (Round 2+) ================= */}
      {step === 'PITCH_SELECTION' && (
        <div className="py-4 space-y-4 text-center animate-fadeIn">
          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-black text-white uppercase">
              📱 Telefonni <span className="text-hazard-orange">{currentPlayer?.name}</span> ga bering!
            </h3>
            <p className="text-xs text-slate-400">
              Ushbu raundda o'zingizni himoya qilish uchun qaysi kartangizni ochmoqchisiz?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto p-1">
            {Object.entries(currentPlayer?.cards || {}).map(([catKey, slot]) => {
              if (slot.isRevealed) {
                return (
                  <div key={catKey} className="opacity-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-emerald-400 font-bold">✓ [OCHILGAN]</span>
                    <div className="text-xs font-bold text-slate-300">{slot.card.title}</div>
                  </div>
                );
              }

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => startSpeaking(catKey as CardCategory, currentTurnPlayerIndex)}
                  className="p-3 rounded-2xl bg-bunker-900 hover:bg-hazard-orange/20 border-2 border-slate-700 hover:border-hazard-orange text-left space-y-1 transition-all active:scale-95 shadow-md"
                >
                  <span className="text-[10px] uppercase font-mono font-bold text-hazard-orange block">
                    [{catKey}]
                  </span>
                  <span className="text-xs font-black text-white block">
                    {slot.card.title}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    🔓 Ochish va Gapirish
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 5. PITCH SPEAKING (Real Card + Pitch Timer) ================= */}
      {step === 'PITCH_SPEAKING' && selectedCardToReveal && currentPlayer && (
        <div className="py-2 space-y-3 animate-fadeIn flex flex-col items-center">
          
          {/* Top Speaker Name & Timer Controls */}
          <div className="w-full p-3 rounded-2xl bg-bunker-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Nutq so'zlovchi:</span>
              <h3 className="text-sm font-black text-hazard-orange uppercase">👤 {currentPlayer.name}</h3>
            </div>

            {/* Timer countdown with Geiger Warning */}
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-xl font-mono font-black text-sm flex items-center gap-1.5 ${
                timerSeconds <= 10 ? 'bg-red-950 text-red-400 border border-red-600 animate-pulse' : 'bg-bunker-950 text-emerald-400 border border-slate-800'
              }`}>
                <Clock size={14} />
                <span>{timerSeconds}s</span>
              </div>

              {/* Pause / Resume */}
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="p-1.5 rounded-lg bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700"
                title={isTimerPaused ? "Davom ettirish" : "Pauza"}
              >
                {isTimerPaused ? <PlayIcon size={14} className="text-emerald-400" /> : <Pause size={14} />}
              </button>

              {/* +30s */}
              <button
                type="button"
                onClick={() => setTimerSeconds((prev) => prev + 30)}
                className="p-1.5 rounded-lg bg-bunker-800 hover:bg-bunker-700 text-amber-300 border border-slate-700 font-bold text-[10px]"
                title="+30 soniya qo'shish"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Centered Big 2:3 Character Card to show friends */}
          <div className="w-full max-w-[260px] py-1">
            <CharacterCard
              category={selectedCardToReveal}
              card={currentPlayer.cards[selectedCardToReveal].card}
              isRevealed={true}
              isOwner={true}
              canReveal={false}
            />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            📱 Telefonni davraga ko'rsatib, nega aynan siz bunkerga kerakligingizni isbotlang!
          </p>

          {/* Finish Pitch Button */}
          <button
            type="button"
            onClick={handleFinishPlayerPitch}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-hazard-orange to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-hazard-md active:scale-95"
          >
            <span>Nutq Tugadi ➡️ Keyingi O'yinchiga Berish</span>
            <SkipForward size={14} />
          </button>
        </div>
      )}

      {/* ================= 6. TABLE OVERVIEW OF ALL OPENED CARDS ================= */}
      {step === 'TABLE_DEBATE' && (
        <div className="py-2 space-y-3 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-bunker-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-hazard-orange" />
              <h3 className="text-xs font-black uppercase text-white">
                Barcha Ochilgan Kartalar Stoli ({roundNumber}-Raund)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Davra Muhokamasi</span>
          </div>

          {/* Table Cards Grid */}
          <div className="space-y-2.5 max-h-[55vh] overflow-y-auto p-1">
            {players.filter((p) => p.isAlive).map((p) => (
              <div key={p.id} className="p-3 rounded-2xl bg-bunker-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-black text-hazard-orange">👤 {p.name}</span>
                  <span className="text-[10px] text-slate-400">Omon qoluvchi</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(p.cards).map(([catKey, slot]) => {
                    if (!slot.isRevealed) {
                      return (
                        <div key={catKey} className="p-1.5 rounded-lg bg-bunker-950 border border-slate-800/60 text-center">
                          <span className="text-[9px] uppercase font-mono text-slate-600">[{catKey}]: ???</span>
                        </div>
                      );
                    }

                    return (
                      <div key={catKey} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-left">
                        <span className="text-[8px] uppercase font-mono text-amber-400 font-bold block">
                          [{catKey}]
                        </span>
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          {slot.card.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playGong();
              setStep('VOTING');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-hazard-orange text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
          >
            🗳️ Muhokama Tugadi ➡️ Ovoz Berish & Chiqarishga O'tish
          </button>
        </div>
      )}

      {/* ================= 7. VOTING (ELIMINATE) ================= */}
      {step === 'VOTING' && (
        <div className="py-4 space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 text-center space-y-2">
            <h3 className="text-sm font-black uppercase text-red-400 tracking-wider">
              💀 OVOZ BERISH NATIJASIDA KIM CHIQARILSIN?
            </h3>
            <p className="text-xs text-slate-400">
              Davrada barcha o'yinchilar kelishgan holda kimni chiqarishga ovoz bergan bo'lsa, o'sha ishtirokchini tanlang:
            </p>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {players.filter((p) => p.isAlive).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleEliminatePlayer(p.id)}
                className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-600 flex items-center justify-between transition-all active:scale-98"
              >
                <div className="text-left">
                  <div className="text-xs font-bold text-white">👤 {p.name}</div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {p.cards.profession?.card?.title}
                  </div>
                </div>
                <span className="text-xs font-black text-red-400 flex items-center gap-1 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800">
                  <Skull size={13} /> Chiqarish
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= 8. POST-ELIMINATION CARDS REVEAL ================= */}
      {step === 'ELIMINATION_REVEAL' && lastEliminatedOfflinePlayer && (
        <EliminationRevealModal
          eliminatedPlayer={lastEliminatedOfflinePlayer as any}
          isHost={true}
          onContinue={handleContinueFromElimination}
        />
      )}

      {/* ================= 9. SURPRISE BUNKER EVENT ================= */}
      {step === 'EVENT' && currentEvent && (
        <div className="py-6 space-y-5 animate-fadeIn text-center">
          <div className="p-6 rounded-3xl bg-amber-950/80 border-2 border-amber-500/80 space-y-3 shadow-2xl">
            <span className="text-3xl">📦</span>
            <h3 className="text-sm font-mono text-amber-300 font-bold uppercase tracking-wider">
              Kutilmagan Bunker Hodisasi!
            </h3>
            <h2 className="text-lg font-black text-white">{currentEvent.title}</h2>
            <p className="text-xs text-slate-200">{currentEvent.description}</p>
          </div>

          <button
            type="button"
            onClick={handleNextRoundFromEvent}
            className="w-full py-3.5 rounded-2xl bg-hazard-orange hover:bg-hazard-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
          >
            {roundNumber + 1}-Raundga O'tish ➡️
          </button>
        </div>
      )}

      {/* ================= 9. FINAL SIMULATION RESULT ================= */}
      {step === 'FINAL_RESULT' && (
        <div className="py-6 space-y-5 text-center animate-fadeIn">
          <div className="p-6 rounded-3xl bg-bunker-900 border-2 border-emerald-500/70 space-y-3 shadow-2xl">
            <Trophy size={40} className="text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-black text-emerald-400 uppercase">
              🎉 G'ALABA! BOSHPANA OMON QOLDI!
            </h2>
            <p className="text-xs text-slate-300">
              Boshpanaga kirgan {survivorCount} nafar mutaxassis yangi sivilizatsiyaga asos soldi:
            </p>

            <div className="space-y-2 pt-3">
              {players.filter((p) => p.isAlive).map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-xs font-bold text-white flex items-center justify-between">
                  <span>🏆 {s.name}</span>
                  <span className="text-emerald-300">{s.cards.profession?.card?.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep('SETUP')}
            className="w-full py-3.5 rounded-2xl bg-hazard-orange text-white font-black text-xs uppercase tracking-wider"
          >
            Yangi O'yinni Boshlash 🔄
          </button>
        </div>
      )}
    </div>
  );
};
