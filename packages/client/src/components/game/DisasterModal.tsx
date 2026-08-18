import React from 'react';
import { Catastrophe, ShelterSpecs } from '@boshpana/shared';
import { AlertTriangle, Shield, Clock, Droplets, Utensils, Zap, X } from 'lucide-react';

interface DisasterModalProps {
  catastrophe: Catastrophe;
  shelterSpecs: ShelterSpecs;
  onClose: () => void;
  isHost: boolean;
  onStartRounds?: () => void;
}

export const DisasterModal: React.FC<DisasterModalProps> = ({
  catastrophe,
  shelterSpecs,
  onClose,
  isHost,
  onStartRounds
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-bunker-900 border-2 border-hazard-orange rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-hazard-lg relative my-auto space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-bunker-800 hover:bg-bunker-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Warning Banner */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-hazard-orange/20 border border-hazard-orange/50 flex items-center justify-center text-hazard-orange flex-shrink-0 animate-pulse">
            <AlertTriangle size={28} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-hazard-orange px-2 py-0.5 rounded bg-hazard-orange/10 border border-hazard-orange/30">
              FAVQULODDA OGOHLANTIRISH
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 mt-1">
              {catastrophe.title}
            </h2>
          </div>
        </div>

        {/* Disaster Story */}
        <div className="p-3.5 rounded-xl bg-bunker-950/90 border border-slate-800 space-y-2">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {catastrophe.fullStory}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {catastrophe.hazards.map((h, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800">
                ⚠️ {h}
              </span>
            ))}
          </div>
        </div>

        {/* Shelter Specs */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Shield size={14} className="text-cyan-400" />
            <span>Boshpana Holati va Sharoitlari:</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-bunker-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Kerakli Muddat:</span>
              <span className="font-mono font-bold text-amber-400">{catastrophe.shelterMonths} oy ({Math.round(catastrophe.shelterMonths / 12 * 10) / 10} yil)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bunker-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Boshpana Maydoni:</span>
              <span className="font-mono font-bold text-cyan-400">{shelterSpecs.areaSqMeters} m²</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bunker-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Oziq-ovqat Zaxirasi:</span>
              <span className="font-mono font-bold text-emerald-400">{shelterSpecs.foodSuppliesMonths} oyga yetadi</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bunker-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Suv Zaxirasi:</span>
              <span className="font-mono font-bold text-emerald-400">{shelterSpecs.waterSuppliesMonths} oyga yetadi</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-bunker-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p><span className="text-slate-400">Mudofaa:</span> {shelterSpecs.defenseStatus}</p>
            <p><span className="text-slate-400">Xususiyat:</span> {shelterSpecs.specialFeature}</p>
            {shelterSpecs.internalThreat && (
              <p className="text-yellow-400/90 font-medium">
                <span className="text-yellow-500">Ichki Xavf:</span> {shelterSpecs.internalThreat}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isHost && onStartRounds ? (
          <button
            type="button"
            onClick={onStartRounds}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm uppercase tracking-wider bg-hazard-orange hover:bg-hazard-orangeDark text-white shadow-hazard-sm transition-all active:scale-98"
          >
            1-Raundni Boshlash (Kasblar Jangi)
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Tushunarli, O'yinga Qaytish
          </button>
        )}
      </div>
    </div>
  );
};
