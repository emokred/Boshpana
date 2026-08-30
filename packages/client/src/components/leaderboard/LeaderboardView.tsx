import React, { useState } from 'react';
import { 
  Trophy, Medal, Award, Flame, ArrowLeft, Shield, 
  Sparkles, Users, CheckCircle2, Lock, Star, ChevronRight
} from 'lucide-react';
import { StatsService, ACHIEVEMENTS_LIST, PlayerStats } from '../../services/statsService';
import { sound } from '../../services/sound';

interface LeaderboardViewProps {
  playerName?: string;
  onBack: () => void;
}

// Global Demo Leaderboard Entries
const TOP_SURVIVORS = [
  { rank: 1, name: 'Sardor_2055', wins: 34, games: 42, title: '👑 Boshpana Afsonasi', prof: '🩺 Bosh Xirurg' },
  { rank: 2, name: 'Malika_Toshkent', wins: 28, games: 36, title: '🎖️ Bunker Faxriysi', prof: '🧬 Genetik Biolog' },
  { rank: 3, name: 'Rustam_Polvon', wins: 22, games: 30, title: '🎖️ Bunker Faxriysi', prof: '🛡️ Kurashchi Polvon' },
  { rank: 4, name: 'Usta_Temur', wins: 19, games: 25, title: '🛡️ Tajribali Omon Qoluvchi', prof: '⚡ Svarkachi' },
  { rank: 5, name: 'Komil_Oshpaz', wins: 14, games: 20, title: '🛡️ Tajribali Omon Qoluvchi', prof: '🍲 To\'y Oshpazi' },
  { rank: 6, name: 'Anvar_Dasturchi', wins: 11, games: 18, title: '⚡ Qat\'iyatli Qochqin', prof: '💻 Xaker' },
  { rank: 7, name: 'Shaxlo_Olima', wins: 9, games: 15, title: '⚡ Qat\'iyatli Qochqin', prof: '🧪 Kimyogar' }
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  playerName = 'Omon Qoluvchi',
  onBack
}) => {
  const [tab, setTab] = useState<'profile' | 'badges' | 'leaderboard'>('profile');
  const stats: PlayerStats = StatsService.getStats();
  const rank = StatsService.getRankTitle(stats.gamesWon);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#FEF3C7] p-3 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b-2 border-[#FBBF24]/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1E40AF]/40 hover:bg-[#1E40AF] border border-[#1E40AF] text-[#FEF3C7] transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Chiqish</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-wide text-[#FBBF24] flex items-center gap-2">
              <Trophy className="text-[#FBBF24]" size={24} />
              <span>Boshpana Reytingi & Yutuqlar</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Omon qoluvchilar darajasi, faxriy nishonlar va global reyting jadvali
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs font-bold">
          <span>Darajangiz:</span>
          <span className={`${rank.color} font-black`}>{rank.title}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#161b22] border border-slate-800 text-xs font-black uppercase tracking-wider">
        <button
          type="button"
          onClick={() => { sound.playClick(); setTab('profile'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'profile' ? 'bg-[#FBBF24] text-[#0d1117] shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award size={15} />
          <span>Mening Profilim</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setTab('badges'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'badges' ? 'bg-[#DC2626] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Medal size={15} />
          <span>Yutuqlar ({stats.unlockedBadgeIds.length}/{ACHIEVEMENTS_LIST.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setTab('leaderboard'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'leaderboard' ? 'bg-[#1E40AF] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy size={15} />
          <span>Top Omon Qoluvchilar</span>
        </button>
      </div>

      {/* ================= 1. TAB: PLAYER PROFILE ================= */}
      {tab === 'profile' && (
        <div className="space-y-6">
          
          {/* Main User Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#161b22] border-2 border-[#FBBF24]/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Trophy size={160} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FBBF24]/20 border-2 border-[#FBBF24] flex items-center justify-center text-2xl font-black text-[#FBBF24] shadow-md">
                  👤
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase">{playerName}</h2>
                  <div className={`text-xs sm:text-sm font-bold ${rank.color} flex items-center gap-1.5 mt-0.5`}>
                    <Star size={14} className="fill-current" />
                    <span>{rank.title} (Daraja {rank.level})</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-[#1E40AF]/30 border border-[#1E40AF] text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Sevimli Kasbingiz:</span>
                <span className="text-xs font-bold text-[#FBBF24]">{stats.favoriteProfession}</span>
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Jami O'yinlar:</span>
                <span className="text-2xl font-black text-white">{stats.gamesPlayed}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block">G'alabalar:</span>
                <span className="text-2xl font-black text-emerald-400">{stats.gamesWon}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-cyan-400 block">Omon Qolish Foizi:</span>
                <span className="text-2xl font-black text-cyan-400">{winRate}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#FBBF24] block">Ketma-ket G'alaba:</span>
                <span className="text-2xl font-black text-[#FBBF24] flex items-center justify-center gap-1">
                  <Flame size={20} className="text-amber-500 fill-amber-500 animate-pulse" />
                  <span>{stats.consecutiveWins}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Badges Showcase */}
          <div className="p-5 rounded-3xl bg-[#161b22] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-[#FBBF24] flex items-center gap-1.5">
                <Medal size={16} /> Ochilgan Nishonlaringiz:
              </h3>
              <button
                type="button"
                onClick={() => setTab('badges')}
                className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-0.5"
              >
                <span>Barchasini ko'rish</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ACHIEVEMENTS_LIST.map((badge) => {
                const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-[#1E40AF]/20 border-[#FBBF24]/60 shadow-md'
                        : 'bg-[#0d1117] border-slate-800/60 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{badge.title}</h4>
                        <span className="text-[9px] text-slate-400">
                          {isUnlocked ? '✓ Olingan' : '🔒 Qulflangan'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. TAB: ACHIEVEMENTS & BADGES ================= */}
      {tab === 'badges' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase text-[#FBBF24]">Boshpana Faxriy Nishonlari</h3>
              <p className="text-[10px] text-slate-400">O'yin davomida strategiyangiz orqali barcha nishonlarni oching!</p>
            </div>
            <span className="text-xs font-black text-emerald-400 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800">
              {stats.unlockedBadgeIds.length} / {ACHIEVEMENTS_LIST.length} Olingan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS_LIST.map((badge) => {
              const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-3xl border-2 transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#1E40AF]/30 to-[#161b22] border-[#FBBF24] shadow-lg'
                      : 'bg-[#161b22] border-slate-800/80 opacity-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    {isUnlocked ? badge.icon : <Lock size={20} className="text-slate-600" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase">{badge.title}</h4>
                      {isUnlocked && (
                        <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                          OCHILDI ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 3. TAB: GLOBAL LEADERBOARD ================= */}
      {tab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase text-[#FBBF24]">Eng Ko'p Omon Qolgan Qahramonlar (Top 7)</h3>
              <p className="text-[10px] text-slate-400 font-mono">Haftalik va doimiy o'yinlar reytingi</p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 font-mono">Jonli Yangilanish</span>
          </div>

          <div className="space-y-2">
            {TOP_SURVIVORS.map((player) => (
              <div
                key={player.rank}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  player.rank === 1
                    ? 'bg-gradient-to-r from-amber-950/40 via-[#161b22] to-amber-950/40 border-[#FBBF24] shadow-md'
                    : player.rank === 2
                    ? 'bg-[#161b22] border-slate-500/60'
                    : player.rank === 3
                    ? 'bg-[#161b22] border-amber-800/60'
                    : 'bg-[#161b22]/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono ${
                    player.rank === 1 ? 'bg-[#FBBF24] text-[#0d1117]' :
                    player.rank === 2 ? 'bg-slate-300 text-slate-900' :
                    player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{player.rank}
                  </div>

                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>👤 {player.name}</span>
                      <span className="text-[9px] font-normal text-slate-400 font-mono">({player.prof})</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400/90">{player.title}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400">{player.wins} G'alaba</div>
                  <span className="text-[9px] text-slate-400 font-mono">{player.games} o'yinda ({Math.round((player.wins/player.games)*100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
