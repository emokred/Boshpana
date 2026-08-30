import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Sparkles, BookOpen, Volume2, VolumeX, AlertTriangle, 
  ArrowRight, Play, Printer, Smartphone, MessageSquare, CheckCircle2, Trophy 
} from 'lucide-react';
import { GameMode } from '@boshpana/shared';
import { sound } from '../../services/sound';

interface JoinCreateViewProps {
  initialName?: string;
  initialRoomCode?: string;
  onCreateRoom: (name: string, mode?: GameMode) => void;
  onJoinRoom: (roomCode: string, name: string) => void;
  onOpenPrintView?: () => void;
  onOpenPassAndPlay?: () => void;
  onOpenDeckStudio?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenBrandIdentity?: () => void;
}

export const JoinCreateView: React.FC<JoinCreateViewProps> = ({
  initialName = '',
  initialRoomCode = '',
  onCreateRoom,
  onJoinRoom,
  onOpenPrintView,
  onOpenPassAndPlay,
  onOpenDeckStudio,
  onOpenLeaderboard,
  onOpenBrandIdentity
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('PASS_AND_PLAY');
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState(initialName || 'Omon Qoluvchi');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [showRules, setShowRules] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  useEffect(() => {
    if (initialRoomCode) {
      setTab('join');
      setRoomCode(initialRoomCode);
      setSelectedMode('ONLINE_FULL');
    }
  }, [initialRoomCode]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectMode = (mode: GameMode) => {
    sound.playClick();
    setSelectedMode(mode);
    if (mode === 'PASS_AND_PLAY' && onOpenPassAndPlay) {
      // Optional direct launch
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    sound.playClick();
    if (selectedMode === 'PASS_AND_PLAY' && onOpenPassAndPlay) {
      onOpenPassAndPlay();
    } else {
      onCreateRoom(playerName.trim(), selectedMode);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCode.trim()) {
      sound.playClick();
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hazard-orange/20 border border-hazard-orange/50 flex items-center justify-center text-hazard-orange font-mono font-bold text-xs">
            BP
          </div>
          <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">
            BOSHPANA v1.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              title="Reyting va Yutuqlar (Leaderboard)"
            >
              <Trophy size={14} className="text-[#FBBF24]" />
              <span className="hidden sm:inline">Reyting</span>
            </button>
          )}

          {onOpenDeckStudio && (
            <button
              type="button"
              onClick={onOpenDeckStudio}
              className="px-2.5 py-1.5 rounded-xl bg-[#FBBF24]/20 hover:bg-[#FBBF24]/30 text-[#FBBF24] border border-[#FBBF24]/50 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              title="Yangi Karta va Falokat Yaratish (Vault-Bek Studio)"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Studiy</span>
            </button>
          )}

          {onOpenBrandIdentity && (
            <button
              type="button"
              onClick={onOpenBrandIdentity}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              title="Rasmiy Logo va Brend (VAULTBEK)"
            >
              <Shield size={14} className="text-purple-400" />
              <span className="hidden sm:inline">Brend</span>
            </button>
          )}

          {onOpenPrintView && (
            <button
              type="button"
              onClick={onOpenPrintView}
              className="px-2.5 py-1.5 rounded-xl bg-bunker-900 hover:bg-bunker-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Stol o'yini kartalarini chop etish (PDF)"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Chop Etish (PDF)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-bunker-900 hover:bg-bunker-800 text-slate-300 border border-slate-800 transition-colors"
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowRules(true);
            }}
            className="p-2 rounded-xl bg-bunker-900 hover:bg-bunker-800 text-slate-300 border border-slate-800 transition-colors"
            title="Qoidalar"
          >
            <BookOpen size={16} />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hazard-orange/15 border border-hazard-orange/40 text-hazard-orange text-[11px] font-mono font-bold uppercase tracking-widest animate-pulse">
          <AlertTriangle size={13} />
          <span>Apokalipsis Ijtimoiy Stol O'yini</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 uppercase tracking-tight">
          Boshpana — <span className="text-transparent bg-clip-text bg-gradient-to-r from-hazard-orange via-amber-400 to-red-500">Kim Omon Qoladi?</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Falokatdan so'ng boshpanada joylar cheklangan. Boshlashdan oldin o'zingizga mos o'yin rejimini tanlang!
        </p>
      </div>

      {/* ================= 1. MANDATORY GAME MODE SELECTOR ================= */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-hazard-orange" />
            <span>1-QADAM: O'yin Rejimini Tanlang (Majburiy):</span>
          </span>
          <span className="text-[10px] text-slate-400 font-sans font-normal">Rejim tanlandi ✓</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* Mode 1: Bitta Telefon (Pass & Play) */}
          <button
            type="button"
            onClick={() => handleSelectMode('PASS_AND_PLAY')}
            className={`p-3.5 rounded-2xl text-left space-y-1.5 transition-all shadow-md active:scale-98 relative border-2 ${
              selectedMode === 'PASS_AND_PLAY'
                ? 'bg-hazard-orange/20 border-hazard-orange shadow-hazard-md'
                : 'bg-bunker-900/90 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <Smartphone size={15} className="text-hazard-orange" />
                <span>📱 Bitta Telefon (Qo'lma-qo'l)</span>
              </span>
              {selectedMode === 'PASS_AND_PLAY' ? (
                <CheckCircle2 size={16} className="text-hazard-orange" />
              ) : (
                <span className="text-[9px] font-mono uppercase bg-hazard-orange/80 text-white px-1.5 py-0.5 rounded font-bold">
                  Tavsiya!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Davrada faqat 1 ta telefon qo'lma-qo'l o'tadi (Spyfall uslubida). Internetsiz ham o'ynash mumkin!
            </p>
          </button>

          {/* Mode 2: Jonli Davra (Gibrid) */}
          <button
            type="button"
            onClick={() => handleSelectMode('HYBRID_OFFLINE')}
            className={`p-3.5 rounded-2xl text-left space-y-1.5 transition-all shadow-md active:scale-98 relative border-2 ${
              selectedMode === 'HYBRID_OFFLINE'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg'
                : 'bg-bunker-900/90 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <Users size={15} className="text-emerald-400" />
                <span>🎲 Jonli Davra (Gibrid)</span>
              </span>
              {selectedMode === 'HYBRID_OFFLINE' && (
                <CheckCircle2 size={16} className="text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Kartalarni har kim o'z telefonida ko'radi, gapirish va tortishuv 100% davrada jonli bo'ladi!
            </p>
          </button>

          {/* Mode 3: To'liq Online (TMA) */}
          <button
            type="button"
            onClick={() => handleSelectMode('ONLINE_FULL')}
            className={`p-3.5 rounded-2xl text-left space-y-1.5 transition-all shadow-md active:scale-98 relative border-2 ${
              selectedMode === 'ONLINE_FULL'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-lg'
                : 'bg-bunker-900/90 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <Sparkles size={15} className="text-cyan-400" />
                <span>🌐 To'liq Online (TMA)</span>
              </span>
              {selectedMode === 'ONLINE_FULL' && (
                <CheckCircle2 size={16} className="text-cyan-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Telegram WebApp ichida: jonli vaqt taymeri, chat, reaksiyalar va anonim ovoz berish.
            </p>
          </button>

          {/* Mode 4: Telegram Guruh (Mafia Bot) */}
          <button
            type="button"
            onClick={() => handleSelectMode('TELEGRAM_GROUP')}
            className={`p-3.5 rounded-2xl text-left space-y-1.5 transition-all shadow-md active:scale-98 relative border-2 ${
              selectedMode === 'TELEGRAM_GROUP'
                ? 'bg-purple-950/40 border-purple-500 shadow-lg'
                : 'bg-bunker-900/90 border-slate-800 hover:border-slate-700 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <MessageSquare size={15} className="text-purple-400" />
                <span>👥 Guruh Rejimi (Mafia Bot)</span>
              </span>
              {selectedMode === 'TELEGRAM_GROUP' && (
                <CheckCircle2 size={16} className="text-purple-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Telegram guruhga botni qo'shib, guruh chatida va guruh ovozli qo'ng'irog'ida o'ynash!
            </p>
          </button>

        </div>
      </div>

      {/* ================= 2. ACTION PANEL BASED ON SELECTED MODE ================= */}
      {selectedMode === 'PASS_AND_PLAY' ? (
        <div className="bg-bunker-900 border-2 border-hazard-orange/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-hazard-orange font-bold text-xs uppercase">
            <Smartphone size={16} />
            <span>Tanlangan Rejim: 📱 Bitta Telefon (Qo'lma-qo'l)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bu rejimda hech qanday server yoki xona kodi kerak emas. Ismlarni kiritib, 1 ta telefonni o'yinchilarga navbat bilan berib o'ynaysiz.
          </p>

          <button
            type="button"
            onClick={onOpenPassAndPlay}
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-2 shadow-hazard-lg transition-all active:scale-98 animate-pulse"
          >
            <Play size={16} />
            <span>📱 Bitta Telefon Rejimini Boshlash</span>
          </button>
        </div>
      ) : selectedMode === 'TELEGRAM_GROUP' ? (
        <div className="bg-bunker-900 border-2 border-purple-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase">
            <MessageSquare size={16} />
            <span>Tanlangan Rejim: 👥 Telegram Guruh Rejimi</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Botni o'z do'stlaringiz bor Telegram guruhga qo'shing va guruh chatida <b>/boshpana</b> deb yozing. Bot shaxsiy kartalarni lichkaga yuboradi va guruhda so'rovnoma orqali o'yinni boshqaradi!
          </p>

          <a
            href="https://t.me/boshpana_gamebot?startgroup=true"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 block text-center"
          >
            <Users size={16} />
            <span>Botni Telegram Guruhga Qo'shish ➡️</span>
          </a>
        </div>
      ) : (
        /* Hybrid / Full Online Rooms */
        <div className="space-y-4 animate-fadeIn">
          {/* Tab Selector: Create vs Join */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-bunker-900 border border-slate-800">
            <button
              type="button"
              onClick={() => { sound.playClick(); setTab('create'); }}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                tab === 'create'
                  ? 'bg-hazard-orange text-white shadow-hazard-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Xona Yaratish
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setTab('join'); }}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                tab === 'join'
                  ? 'bg-hazard-orange text-white shadow-hazard-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Xonaga Ulanish
            </button>
          </div>

          <div className="bg-bunker-900 border-2 border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl girih-card">
            {tab === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Ismingiz yoki Taxallusingiz:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={24}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Masalan: Sardor, Komil..."
                    className="w-full px-4 py-3 rounded-xl bg-bunker-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-orange focus:ring-1 focus:ring-hazard-orange font-medium text-sm transition-all"
                  />
                </div>

                <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>Siz xona egasi (Host) bo'lasiz</span>
                  </p>
                  <p>
                    Rejim: <b>{selectedMode === 'HYBRID_OFFLINE' ? '🎲 Jonli Davra (Gibrid)' : '🌐 To\'liq Online (TMA)'}</b>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-2 shadow-hazard-sm transition-all active:scale-98"
                >
                  <Play size={16} />
                  <span>Xonani Ochish ➡️</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Ismingiz yoki Taxallusingiz:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={24}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ismingiz..."
                    className="w-full px-4 py-3 rounded-xl bg-bunker-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-hazard-orange focus:ring-1 focus:ring-hazard-orange font-medium text-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Xona Kodi (Room Code):
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Masalan: BOSH-782"
                    className="w-full px-4 py-3 rounded-xl bg-bunker-950 border border-slate-800 text-hazard-orange font-mono font-bold tracking-wider placeholder-slate-600 focus:outline-none focus:border-hazard-orange focus:ring-1 focus:ring-hazard-orange text-sm transition-all uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white flex items-center justify-center gap-2 shadow-cyber-cyan transition-all active:scale-98"
                >
                  <ArrowRight size={16} />
                  <span>Xonaga Qo'shilish</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bunker-900 border-2 border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <BookOpen size={18} className="text-hazard-orange" />
                <span>Boshpana O'yini Qoidalari</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-bunker-800"
              >
                Yopish
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>1. Maqsad:</strong> Apokalipsis yuz bergan dunyoda yopiq Boshpanaga (Bunkerga) kirish va sivilizatsiyani qayta tiklash. Joylar soni cheklangan!
              </p>
              <p>
                <strong>2. 1-Raund (Kasblar Jangi):</strong> Hamma o'zining <strong>Kasbini</strong> ochadi va nega aynan u bunkerga kerakligini 45 soniya ichida tushuntiradi.
              </p>
              <p>
                <strong>3. Keyingi Raundlar:</strong> 2-raunddan boshlab har bir o'yinchi qolgan yashirin kartalaridan (<em>Biologiya, Salomatlik, Bagaj, Fakt, Xobbi</em>) qaysi birini ochishni <strong>o'zi strategik tanlaydi</strong>.
              </p>
              <p>
                <strong>4. Ovoz Berish:</strong> Har raund so'ngida eng kam foydali deb topilgan 1 kishi ovoz berish orqali boshpanadan chiqarib yuboriladi.
              </p>
              <p>
                <strong>5. Final Simulyatsiyasi:</strong> Qolgan g'oliblar bunkerga kiradi va algoritm ularning oziq-ovqat, tibbiyot, texnika va ruhiyat ko'rsatkichlari asosida omon qolgan-qolmaganini ko'rsatadi!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700"
            >
              Tushunarli!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
