import React, { useState } from 'react';
import { 
  CARDS_DATA, CATASTROPHES, SHELTER_SPECS_PRESETS, BUNKER_EVENTS,
  CardCategory, CardItem, PlayerCardSlot, Catastrophe, ShelterSpecs, BunkerEvent
} from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { 
  Smartphone, Users, Play, ArrowRight, Eye, EyeOff, 
  RotateCcw, Skull, Trophy, AlertTriangle, Shield, Check, Flame
} from 'lucide-react';
import { sound } from '../../services/sound';

interface OfflinePlayer {
  id: string;
  name: string;
  isAlive: boolean;
  cards: Record<CardCategory, PlayerCardSlot>;
}

export const PassAndPlayView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [step, setStep] = useState<'SETUP' | 'PASS_CARDS' | 'GAME_ROUND' | 'VOTING' | 'EVENT' | 'FINAL_RESULT'>('SETUP');
  const [playerNames, setPlayerNames] = useState<string[]>(['Ali', 'Vali', 'Guli', 'Sami']);
  const [newPlayerInput, setNewPlayerInput] = useState('');
  
  // Game state
  const [players, setPlayers] = useState<OfflinePlayer[]>([]);
  const [currentPassIndex, setCurrentPassIndex] = useState(0);
  const [isCardRevealedToPlayer, setIsCardRevealedToPlayer] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [catastrophe, setCatastrophe] = useState<Catastrophe | null>(null);
  const [shelter, setShelter] = useState<ShelterSpecs | null>(null);
  const [currentEvent, setCurrentEvent] = useState<BunkerEvent | null>(null);
  const [survivorCount, setSurvivorCount] = useState(2);

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
    setCurrentPassIndex(0);
    setIsCardRevealedToPlayer(false);
    setRoundNumber(1);
    setStep('PASS_CARDS');
  };

  // Pass-and-play card viewing
  const handleNextPass = () => {
    sound.playClick();
    setIsCardRevealedToPlayer(false);
    if (currentPassIndex + 1 < players.length) {
      setCurrentPassIndex(currentPassIndex + 1);
    } else {
      // Everyone has seen their cards -> Move to Game Round
      sound.playVoteGong();
      setStep('GAME_ROUND');
    }
  };

  // Eliminate player in voting
  const handleEliminatePlayer = (playerId: string) => {
    sound.playElimination();
    const updated = players.map((p) => p.id === playerId ? { ...p, isAlive: false } : p);
    setPlayers(updated);

    const aliveCount = updated.filter((p) => p.isAlive).length;
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
    setStep('GAME_ROUND');
  };

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
            <p className="text-[10px] text-slate-400">Spyfall uslubida 1 ta telefonda navbat bilan o'ynash</p>
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

      {/* ================= STEP 1: SETUP PLAYERS ================= */}
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

      {/* ================= STEP 2: PASS PHONE & VIEW CARDS ================= */}
      {step === 'PASS_CARDS' && (
        <div className="py-6 space-y-6 text-center animate-fadeIn">
          {!isCardRevealedToPlayer ? (
            <div className="p-8 rounded-3xl bg-bunker-900 border-2 border-hazard-orange/50 space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-hazard-orange/20 border-2 border-hazard-orange flex items-center justify-center text-hazard-orange mx-auto animate-bounce">
                <Smartphone size={32} />
              </div>
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest">Navbat:</h3>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                📱 Telefonni <span className="text-hazard-orange">{players[currentPassIndex]?.name}</span> ga bering!
              </h2>
              <p className="text-xs text-slate-400">
                Boshqalar qaramay tursin. O'z kartalaringizni ko'rish uchun pastdagi tugmani bosing.
              </p>

              <button
                type="button"
                onClick={() => {
                  sound.playPeek();
                  setIsCardRevealedToPlayer(true);
                }}
                className="w-full py-3 rounded-xl bg-hazard-orange text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
              >
                👁️ Kartalarimni Ko'rish
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-bunker-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-hazard-orange">
                  👤 {players[currentPassIndex]?.name} ning Kartalari:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentPassIndex + 1} / {players.length}
                </span>
              </div>

              {/* Player Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto p-1">
                {Object.entries(players[currentPassIndex]?.cards || {}).map(([catKey, slot]) => (
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
                onClick={handleNextPass}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Yopish va Telefonni Keyingisiga Berish</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 3: GAME ROUND & REAL-LIFE DEBATE ================= */}
      {step === 'GAME_ROUND' && (
        <div className="py-4 space-y-4 animate-fadeIn">
          {/* Disaster Banner */}
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-mono font-black text-red-400 tracking-wider">
              🚨 {roundNumber}-RAUND | {catastrophe?.title}
            </span>
            <p className="text-xs text-slate-200">{catastrophe?.shortDesc}</p>
          </div>

          {/* Shelter specs */}
          <div className="p-3 rounded-xl bg-bunker-900 border border-slate-800 text-center text-xs text-slate-300">
            🏛️ <b>Boshpana:</b> Maydoni {shelter?.areaSqMeters} kv.m, {shelter?.durationMonths} oylik resurs
          </div>

          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-300">
              🗣️ Real Hayotda Navbatma-Navbat O'zingizni Himoya Qiling:
            </h4>
            <p className="text-xs text-slate-400">
              Har bir kishi davrada gapirib, nega boshpanaga aynan o'zi kirishi kerakligini isbotlaydi.
            </p>

            <div className="space-y-2 pt-2">
              {players.filter((p) => p.isAlive).map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">👤 {p.name}</span>
                  <span className="text-[11px] text-amber-400 font-medium">
                    Kasbi: {p.cards.profession?.card?.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playVoteGong();
              setStep('VOTING');
            }}
            className="w-full py-3 rounded-2xl bg-hazard-orange hover:bg-hazard-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
          >
            🗳️ Muhokama Tugadi ➡️ Ovoz Berishga O'tish
          </button>
        </div>
      )}

      {/* ================= STEP 4: VOTING (ELIMINATE) ================= */}
      {step === 'VOTING' && (
        <div className="py-6 space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-bunker-900 border border-slate-800 text-center space-y-2">
            <h3 className="text-sm font-black uppercase text-red-400 tracking-wider">
              💀 OVOZ BERISH NATIJASIDA KIM CHIQARILSIN?
            </h3>
            <p className="text-xs text-slate-400">
              Davrada hamma bir ovozdan kimni chiqarishga qaror qilgan bo'lsa, o'sha odamni tanlang:
            </p>
          </div>

          <div className="space-y-2">
            {players.filter((p) => p.isAlive).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleEliminatePlayer(p.id)}
                className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-600 flex items-center justify-between transition-all"
              >
                <div className="text-left">
                  <div className="text-xs font-bold text-white">👤 {p.name}</div>
                  <div className="text-[10px] text-slate-400">{p.cards.profession?.card?.title}</div>
                </div>
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <Skull size={14} /> Chiqarish
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= STEP 5: SURPRISE BUNKER EVENT ================= */}
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
            className="w-full py-3 rounded-2xl bg-hazard-orange hover:bg-hazard-orangeDark text-white font-black text-xs uppercase tracking-wider shadow-hazard-md"
          >
            Keyingi Raundga O'tish ➡️
          </button>
        </div>
      )}

      {/* ================= STEP 6: FINAL RESULT ================= */}
      {step === 'FINAL_RESULT' && (
        <div className="py-6 space-y-5 text-center animate-fadeIn">
          <div className="p-6 rounded-3xl bg-bunker-900 border-2 border-emerald-500/70 space-y-3 shadow-2xl">
            <Trophy size={40} className="text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-black text-emerald-400 uppercase">
              🎉 G'ALABA! BOSHPANA OMON QOLDI!
            </h2>
            <p className="text-xs text-slate-300">
              Boshpanaga kirgan {survivorCount} nafar mutaxassis apokalipsisdan omon chiqdi:
            </p>

            <div className="space-y-2 pt-3">
              {players.filter((p) => p.isAlive).map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs font-bold text-white flex items-center justify-between">
                  <span>🏆 {s.name}</span>
                  <span className="text-emerald-300">{s.cards.profession?.card?.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep('SETUP')}
            className="w-full py-3 rounded-2xl bg-hazard-orange text-white font-black text-xs uppercase tracking-wider"
          >
            Yangi O'yinni Boshlash 🔄
          </button>
        </div>
      )}
    </div>
  );
};
