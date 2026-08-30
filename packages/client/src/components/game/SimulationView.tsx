import React, { useEffect } from 'react';
import { SimulationResult } from '@boshpana/shared';
import { Trophy, Skull, Users, Heart, Zap, Shield, Utensils, Brain, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/sound';

interface SimulationViewProps {
  simulation: SimulationResult;
  onPlayAgain?: () => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  simulation,
  onPlayAgain
}) => {
  useEffect(() => {
    if (simulation.isSuccess) {
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      sound.playAlarm();
    }
  }, [simulation.isSuccess]);

  const { isSuccess, survivalScore, headline, detailedStory, breakdown, survivors } = simulation;

  return (
    <div className="bg-bunker-900 border-2 border-slate-700 rounded-2xl p-5 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-2xl animate-fadeIn">
      {/* Banner / Header */}
      <div className={`p-5 rounded-2xl border text-center relative overflow-hidden ${
        isSuccess
          ? 'bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
          : 'bg-red-950/70 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
      }`}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 border shadow-lg bg-bunker-950">
          {isSuccess ? (
            <Trophy size={36} className="text-emerald-400" />
          ) : (
            <Skull size={36} className="text-red-500" />
          )}
        </div>

        <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-bunker-950/80 border border-slate-700 text-slate-300">
          Boshpana Taqdiri Simulyatsiyasi
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-2 mb-1">
          {headline}
        </h2>

        <p className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
          Omon Qolish Ko'rsatkichi: {survivalScore}%
        </p>
      </div>

      {/* Breakdown Status Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          Resurslar va Barqarorlik Tahlili:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Food */}
          <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Utensils size={15} className="text-orange-400" />
              <span>Oziq-ovqat va Suv:</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase">
              {breakdown.foodStatus === 'abundance' ? '🟢 To\'liq yetarli' : breakdown.foodStatus === 'enough' ? '🟡 Yetarli' : '🔴 Ochlik'}
            </span>
          </div>

          {/* Health */}
          <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Heart size={15} className="text-emerald-400" />
              <span>Tibbiy Holat:</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase">
              {breakdown.healthStatus === 'healthy' ? '🟢 Sog\'lom' : breakdown.healthStatus === 'illness_treated' ? '🟡 Davolandi' : '🔴 Epidemiya'}
            </span>
          </div>

          {/* Tech */}
          <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Zap size={15} className="text-cyan-400" />
              <span>Energetika va Tizimlar:</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase">
              {breakdown.technicalStatus === 'flourishing' ? '🟢 A\'lo' : breakdown.technicalStatus === 'repaired' ? '🟡 Ta\'mirlandi' : '🔴 Tok o\'chdi'}
            </span>
          </div>

          {/* Reproduction Tile */}
          <div className="p-3 rounded-xl bg-bunker-950 border border-slate-800 flex items-center justify-between sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Users size={15} className="text-pink-400" />
              <span>Insoniyat Nasli Davomiyligi (Ko'payish):</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase">
              {simulation.reproductionStatus === 'fertile_pair'
                ? '🟢 Erkak & Ayol Juftligi (Nasl bor)'
                : simulation.reproductionStatus === 'embryo_bank'
                ? '🧬 Sun\'iy Embrionlar Banki'
                : '🔴 Xavf: Bir jinsli guruh (Nasl yo\'q)'}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Story Narrative */}
      <div className="p-4 rounded-xl bg-bunker-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
        <p className="font-mono text-amber-400 font-bold uppercase text-xs">
          📜 Voqealar Epilogi:
        </p>
        <p className="italic">{detailedStory}</p>
      </div>

      {/* Survivors List */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <Users size={14} />
          <span>Boshpana Ichidagi G'olib Omon Qoluvchilar:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {survivors.map((s) => (
            <div key={s.id} className="p-2.5 rounded-lg bg-bunker-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{s.displayName}</span>
              <span className="text-amber-400 font-mono">{s.profession}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {onPlayAgain && (
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-hazard-orange hover:bg-hazard-orangeDark text-white flex items-center justify-center gap-2 shadow-hazard-sm transition-all active:scale-98"
        >
          <RefreshCw size={16} />
          <span>Yangi O'yinni Boshlash</span>
        </button>
      )}
    </div>
  );
};
