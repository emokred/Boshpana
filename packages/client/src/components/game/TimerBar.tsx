import React, { useEffect } from 'react';
import { Play, Pause, Plus, SkipForward, FastForward, Clock } from 'lucide-react';
import { sound } from '../../services/sound';

interface TimerBarProps {
  timeRemainingSec: number;
  totalDurationSec: number;
  isPaused: boolean;
  activeSpeakerName?: string;
  isMyTurn: boolean;
  isHost: boolean;
  phaseLabel: string;
  onPauseToggle?: () => void;
  onAdd30Sec?: () => void;
  onEndTurn?: () => void;
  onSkipPhase?: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  timeRemainingSec,
  totalDurationSec,
  isPaused,
  activeSpeakerName,
  isMyTurn,
  isHost,
  phaseLabel,
  onPauseToggle,
  onAdd30Sec,
  onEndTurn,
  onSkipPhase
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemainingSec / (totalDurationSec || 1)) * 100));
  const isUrgent = timeRemainingSec <= 10 && timeRemainingSec > 0 && !isPaused;

  useEffect(() => {
    if (isUrgent) {
      sound.playGeiger();
    }
  }, [timeRemainingSec, isUrgent]);

  return (
    <div className="bg-bunker-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
      {/* Top Bar: Phase & Speaker */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-hazard-orange/20 text-hazard-orange border border-hazard-orange/40 text-xs font-mono font-bold uppercase tracking-wider">
            <Clock size={12} className={isUrgent ? 'animate-spin' : ''} />
            {phaseLabel}
          </span>
          {activeSpeakerName && (
            <span className="text-xs text-slate-300 font-medium truncate max-w-[150px] sm:max-w-[240px]">
              🎙 <span className={isMyTurn ? 'text-amber-400 font-bold' : 'text-slate-100'}>{isMyTurn ? 'SIZNING NAVBATINGIZ' : activeSpeakerName}</span>
            </span>
          )}
        </div>

        {/* Digital Clock */}
        <div className={`font-mono text-lg sm:text-xl font-black px-3 py-0.5 rounded-xl border ${
          isUrgent 
            ? 'bg-red-950/90 text-red-400 border-red-500/60 animate-pulse' 
            : isPaused
              ? 'bg-slate-900 text-yellow-400 border-yellow-500/40'
              : 'bg-bunker-950 text-slate-100 border-slate-700'
        }`}>
          {String(Math.floor(timeRemainingSec / 60)).padStart(2, '0')}:
          {String(timeRemainingSec % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2.5 bg-bunker-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            isUrgent 
              ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' 
              : percentage > 50
                ? 'bg-gradient-to-r from-emerald-500 to-hazard-orange'
                : 'bg-hazard-orange'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Control Buttons for Speaker / Host */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        {/* Speaker can finish their turn early */}
        {isMyTurn && onEndTurn && (
          <button
            type="button"
            onClick={onEndTurn}
            className="px-3.5 py-1.5 rounded-xl bg-hazard-orange hover:bg-hazard-orangeDark text-white text-xs font-bold flex items-center gap-1.5 shadow-hazard-sm transition-all active:scale-95 animate-pulse"
          >
            <SkipForward size={13} />
            <span>Nutqni Yakunlash</span>
          </button>
        )}

        {/* Host Control Actions */}
        {isHost && (
          <div className="flex items-center gap-1.5 ml-auto">
            {onPauseToggle && (
              <button
                type="button"
                onClick={onPauseToggle}
                className="px-2.5 py-1.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                title={isPaused ? "Davom ettirish" : "Vaqtni to'xtatish"}
              >
                {isPaused ? <Play size={12} className="text-emerald-400" /> : <Pause size={12} className="text-yellow-400" />}
                <span>{isPaused ? 'Davom' : 'Pauza'}</span>
              </button>
            )}

            {onAdd30Sec && (
              <button
                type="button"
                onClick={onAdd30Sec}
                className="px-2.5 py-1.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                title="+30 soniya qo'shish"
              >
                <Plus size={12} className="text-cyan-400" />
                <span>+30s</span>
              </button>
            )}

            {onSkipPhase && (
              <button
                type="button"
                onClick={onSkipPhase}
                className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                title="Bosqichni o'tkazish"
              >
                <FastForward size={12} />
                <span>O'tkazish (Skip)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
