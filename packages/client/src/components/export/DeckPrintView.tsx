import React, { useState } from 'react';
import { CARDS_DATA, CATASTROPHES, CardCategory, DeckTheme } from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { Printer, Download, ArrowLeft, Filter, Layers } from 'lucide-react';
import { sound } from '../../services/sound';

interface DeckPrintViewProps {
  onBack: () => void;
}

export const DeckPrintView: React.FC<DeckPrintViewProps> = ({ onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState<DeckTheme | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');

  const filteredCards = CARDS_DATA.filter((c) => {
    const matchTheme = selectedTheme === 'all' || c.theme === selectedTheme;
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchTheme && matchCat;
  });

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6">
      
      {/* Top Header Controls (Hidden during actual print) */}
      <div className="print:hidden max-w-6xl mx-auto bg-bunker-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-bunker-800 hover:bg-bunker-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>Orqaga</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase text-hazard-orange tracking-wider flex items-center gap-2">
              <Layers size={20} />
              <span>Stol O'yini Kartalarini Chop Etish (Print & PDF)</span>
            </h1>
            <p className="text-xs text-slate-400">
              Jami {filteredCards.length} ta karta chop etishga tayyor (A4 formatda terilgan)
            </p>
          </div>
        </div>

        {/* Filter Badges & Print Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Theme filter */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-bunker-950 border border-slate-700 text-xs text-slate-200 font-bold focus:outline-none focus:border-hazard-orange"
          >
            <option value="all">Barcha Mavzular</option>
            <option value="classic">🟢 Klassik Apokalipsis</option>
            <option value="uzbek">🏛️ O'zbekona Kolorit</option>
            <option value="nsfw18">🔴 18+ Qora Yumor</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-bunker-950 border border-slate-700 text-xs text-slate-200 font-bold focus:outline-none focus:border-hazard-orange"
          >
            <option value="all">Barcha Turlar</option>
            <option value="profession">Kasblar</option>
            <option value="biology">Biologiya</option>
            <option value="health">Salomatlik</option>
            <option value="baggage">Bagaj</option>
            <option value="hobby">Xobbi</option>
            <option value="fact">Faktlar</option>
            <option value="special">Maxsus Kartalar</option>
          </select>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-hazard-orange to-red-600 hover:from-hazard-orangeDark hover:to-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-hazard-md transition-all active:scale-95 animate-pulse"
          >
            <Printer size={16} />
            <span>PDF / Chop Etish</span>
          </button>
        </div>
      </div>

      {/* High Resolution Cards Grid (Printable Page Layout) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-2">
        {filteredCards.map((card) => (
          <div key={card.id} className="w-full break-inside-avoid">
            <CharacterCard
              category={card.category}
              card={card}
              isRevealed={true}
              isOwner={true}
              canReveal={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
