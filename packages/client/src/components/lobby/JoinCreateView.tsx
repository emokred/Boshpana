import React, { useState, useEffect } from 'react';
import { Shield, Users, Sparkles, BookOpen, Volume2, VolumeX, AlertTriangle, ArrowRight, Play, Printer } from 'lucide-react';
import { sound } from '../../services/sound';

interface JoinCreateViewProps {
  initialName?: string;
  initialRoomCode?: string;
  onCreateRoom: (name: string) => void;
  onJoinRoom: (roomCode: string, name: string) => void;
  onOpenPrintView?: () => void;
}

export const JoinCreateView: React.FC<JoinCreateViewProps> = ({
  initialName = '',
  initialRoomCode = '',
  onCreateRoom,
  onJoinRoom,
  onOpenPrintView
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState(initialName || 'Omon Qoluvchi');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [showRules, setShowRules] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  useEffect(() => {
    if (initialRoomCode) {
      setTab('join');
      setRoomCode(initialRoomCode);
    }
  }, [initialRoomCode]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      sound.playClick();
      onCreateRoom(playerName.trim());
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

      {/* Hero Banner (Shelter42 Style) */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hazard-orange/15 border border-hazard-orange/40 text-hazard-orange text-[11px] font-mono font-bold uppercase tracking-widest animate-pulse">
          <AlertTriangle size={13} />
          <span>Apokalipsis Ijtimoiy Stol O'yini</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 uppercase tracking-tight">
          Boshpana — <span className="text-transparent bg-clip-text bg-gradient-to-r from-hazard-orange via-amber-400 to-red-500">Kim Omon Qoladi?</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Falokatdan so'ng boshpanada joylar cheklangan. Har kim o'z kasbi, bilimi va mahoratini isbotlab, bunkerda qolishga loyiqligini ko'rsatishi shart!
        </p>
      </div>

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

      {/* Form Card */}
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
              <p>O'yin qoidalari, raundlar soni va kartalar to'plamini o'zingiz boshqarasiz.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white flex items-center justify-center gap-2 shadow-hazard-sm transition-all active:scale-98"
            >
              <Play size={16} />
              <span>Yangi Xona Ochish</span>
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
