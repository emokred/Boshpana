import React, { useState } from 'react';
import { 
  Shield, Download, Copy, Check, Sparkles, Award, 
  Palette, Flame, ArrowLeft, Image as ImageIcon, Eye
} from 'lucide-react';
import { sound } from '../../services/sound';

export const BrandIdentityView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    sound.playClick();
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#FEF3C7] p-3 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-[#FBBF24]/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1E40AF]/40 hover:bg-[#1E40AF] border border-[#1E40AF] text-[#FEF3C7] transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Orqaga</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-wide text-[#FBBF24] flex items-center gap-2">
              <Shield className="text-[#DC2626]" size={24} />
              <span>BOSHPANA Rasmiy Brend & Logo To'plami</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Rasmiy stil kodi: <b className="text-[#FBBF24]">VAULTBEK</b> (1950s Retro Fallout + O'zbekona Xon-Atlas)
            </p>
          </div>
        </div>
      </div>

      {/* ================= 1. OFFICIAL LOGO SHOWCASE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Logo Dark Theme */}
        <div className="p-6 rounded-3xl bg-[#161b22] border-4 border-[#FBBF24] shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Asosiy Logo (To'q Fondagi Versiya)
          </span>

          {/* SVG Vector Logo */}
          <div className="w-36 h-36 relative flex items-center justify-center">
            {/* 8-Pointed Star Girih Border */}
            <div className="absolute inset-0 border-4 border-[#FBBF24] rotate-45 rounded-2xl animate-pulse opacity-40"></div>
            <div className="w-28 h-28 rounded-full bg-[#0d1117] border-4 border-[#FBBF24] flex flex-col items-center justify-center shadow-xl z-10">
              <span className="text-3xl">☢️</span>
              <span className="text-[8px] font-mono font-black text-[#FBBF24] uppercase tracking-wider">
                VAULTBEK
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-wider text-white">
              BOSHPANA
            </h2>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FBBF24]">
              Apokalipsis Ijtimoiy Stol O'yini
            </h4>
          </div>
        </div>

        {/* Logo Light / Packaging Theme */}
        <div className="p-6 rounded-3xl bg-[#FEF3C7] text-slate-900 border-4 border-[#DC2626] shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest">
            Quti va Bosma Muqova uchun Logo (Och Fon)
          </span>

          <div className="w-36 h-36 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-[#DC2626] rotate-45 rounded-2xl opacity-40"></div>
            <div className="w-28 h-28 rounded-full bg-[#1E40AF] border-4 border-[#DC2626] flex flex-col items-center justify-center shadow-xl z-10 text-white">
              <span className="text-3xl">☢️</span>
              <span className="text-[8px] font-mono font-black text-[#FEF3C7] uppercase tracking-wider">
                2055
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-wider text-[#0d1117]">
              BOSHPANA
            </h2>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#DC2626]">
              Kim Omon Qoladi?
            </h4>
          </div>
        </div>

      </div>

      {/* ================= 2. VAULTBEK COLOR PALETTE ================= */}
      <div className="p-6 rounded-3xl bg-[#161b22] border-2 border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-black uppercase text-[#FBBF24] tracking-widest flex items-center gap-2">
          <Palette size={18} className="text-[#DC2626]" /> Rasmiy VAULTBEK Ranglar Palitrasi (HEX Kodlari):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            type="button"
            onClick={() => copyHex('#FBBF24')}
            className="p-4 rounded-2xl bg-[#FBBF24] text-[#0d1117] font-black text-left space-y-1 transition-transform hover:scale-102 active:scale-98 shadow-md"
          >
            <span className="text-xs block uppercase">Bunker Sariq</span>
            <span className="text-base font-mono block">#FBBF24</span>
            <span className="text-[9px] opacity-80 block font-normal">
              {copiedColor === '#FBBF24' ? '✓ Nusxalandi!' : 'Asosiy xavf & diqqat'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyHex('#1E40AF')}
            className="p-4 rounded-2xl bg-[#1E40AF] text-white font-black text-left space-y-1 transition-transform hover:scale-102 active:scale-98 shadow-md"
          >
            <span className="text-xs block uppercase">Samarqand Moviy</span>
            <span className="text-base font-mono block">#1E40AF</span>
            <span className="text-[9px] opacity-80 block font-normal">
              {copiedColor === '#1E40AF' ? '✓ Nusxalandi!' : 'Texnika va ishonch'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyHex('#DC2626')}
            className="p-4 rounded-2xl bg-[#DC2626] text-white font-black text-left space-y-1 transition-transform hover:scale-102 active:scale-98 shadow-md"
          >
            <span className="text-xs block uppercase">Qizil Chilla</span>
            <span className="text-base font-mono block">#DC2626</span>
            <span className="text-[9px] opacity-80 block font-normal">
              {copiedColor === '#DC2626' ? '✓ Nusxalandi!' : 'Falokat & chiziqlar'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyHex('#FEF3C7')}
            className="p-4 rounded-2xl bg-[#FEF3C7] text-slate-900 font-black text-left space-y-1 transition-transform hover:scale-102 active:scale-98 shadow-md"
          >
            <span className="text-xs block uppercase">Qadimiy Qog'oz</span>
            <span className="text-base font-mono block">#FEF3C7</span>
            <span className="text-[9px] opacity-80 block font-normal">
              {copiedColor === '#FEF3C7' ? '✓ Nusxalandi!' : 'Vintage fonlar'}
            </span>
          </button>

        </div>
      </div>

      {/* ================= 3. VAULTBEK MASCOT CONCEPT ================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161b22] to-[#07080c] border-2 border-[#FBBF24]/50 space-y-3">
        <h3 className="text-xs font-mono font-black uppercase text-[#FBBF24] tracking-widest flex items-center gap-2">
          <Sparkles size={18} /> Rasmiy Maskot: "Vault-Bek"
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          <b>Vault-Bek</b> — an'anaviy o'zbek do'ppisi va yengil chizilgan xon-atlas choponida bo'lgan, doimo tabassum bilan bosh barmog'ini ko'rsatib turuvchi 1950-yillar retro-komiks qahramoni. U eng og'ir apokalipsis va radiatsiya sharoitida ham xalqona yumor va optimizmni saqlab qoladi!
        </p>
      </div>

    </div>
  );
};
