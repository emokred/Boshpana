import React, { useState } from 'react';
import { 
  CARDS_DATA, CATASTROPHES, SHELTER_SPECS_PRESETS, CardCategory, DeckTheme 
} from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { 
  Printer, Download, ArrowLeft, Filter, Layers, BookOpen, 
  Package, Sparkles, CheckCircle2, Shield, AlertTriangle, 
  Flame, Skull, Trophy, Info, QrCode
} from 'lucide-react';
import { sound } from '../../services/sound';

interface DeckPrintViewProps {
  onBack: () => void;
}

export const DeckPrintView: React.FC<DeckPrintViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'cards_a4' | 'card_backs' | 'rulebook_a5' | 'box_packaging'>('cards_a4');
  const [selectedTheme, setSelectedTheme] = useState<DeckTheme | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');

  const filteredCards = CARDS_DATA.filter((c) => {
    const matchTheme = selectedTheme === 'all' || c.theme === selectedTheme;
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchTheme && matchCat;
  });

  // Split into chunks of 9 for A4 pages (3x3 grid)
  const chunkedPages: (typeof filteredCards)[] = [];
  for (let i = 0; i < filteredCards.length; i += 9) {
    chunkedPages.push(filteredCards.slice(i, i + 9));
  }

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#FEF3C7] p-3 sm:p-6 space-y-6">
      
      {/* Top Header Controls (Hidden in actual print) */}
      <div className="print:hidden max-w-6xl mx-auto bg-[#161b22] border-2 border-[#FBBF24]/50 rounded-3xl p-5 shadow-2xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl bg-[#1E40AF]/40 hover:bg-[#1E40AF] border border-[#1E40AF] text-[#FEF3C7] transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft size={16} />
              <span>Orqaga</span>
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-black uppercase text-[#FBBF24] tracking-wide flex items-center gap-2">
                <Package className="text-[#DC2626]" size={24} />
                <span>Boshpana Stol O'yini — Bosmaxona Paketi (Production Deck)</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                130+ Kartalar A4 Terimi (3x3 Grid), 8-Sahifali Qoidalar Kitobchasi (A5) va Quti Maketi
              </p>
            </div>
          </div>

          {/* Master Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FBBF24] via-amber-500 to-[#DC2626] hover:from-amber-400 hover:to-red-600 text-[#0d1117] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 animate-pulse"
          >
            <Printer size={18} />
            <span>PDF Yuklab Olish / Chop Etish</span>
          </button>
        </div>

        {/* 4 Production Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('cards_a4'); }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'cards_a4' ? 'bg-[#FBBF24] text-[#0d1117] shadow-md' : 'bg-[#0d1117] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            <span>1. A4 Karta Terimi (Oldi)</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('card_backs'); }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'card_backs' ? 'bg-[#1E40AF] text-white shadow-md' : 'bg-[#0d1117] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            <span>2. A4 Karta Ko'ylagi (Orqa)</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('rulebook_a5'); }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'rulebook_a5' ? 'bg-[#DC2626] text-white shadow-md' : 'bg-[#0d1117] text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={14} />
            <span>3. Qoidalar Kitobchasi (A5)</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('box_packaging'); }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'box_packaging' ? 'bg-amber-600 text-white shadow-md' : 'bg-[#0d1117] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package size={14} />
            <span>4. Quti Maketi (Box Art)</span>
          </button>
        </div>

        {/* Filters bar (only for cards) */}
        {(activeTab === 'cards_a4' || activeTab === 'card_backs') && (
          <div className="flex items-center gap-3 pt-2 text-xs flex-wrap">
            <span className="text-slate-400 font-bold">Filtrlar:</span>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#0d1117] border border-slate-700 text-slate-200 font-bold focus:outline-none focus:border-[#FBBF24]"
            >
              <option value="all">Barcha Mavzular</option>
              <option value="classic">🟢 Klassik Apokalipsis</option>
              <option value="uzbek">🏛️ O'zbekona Kolorit</option>
              <option value="nsfw18">🔴 18+ Qora Yumor</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#0d1117] border border-slate-700 text-slate-200 font-bold focus:outline-none focus:border-[#FBBF24]"
            >
              <option value="all">Barcha Turlar</option>
              <option value="profession">Kasblar (Professions)</option>
              <option value="biology">Biologiya (Biology)</option>
              <option value="health">Salomatlik (Health)</option>
              <option value="baggage">Bagaj (Baggage)</option>
              <option value="hobby">Xobbi (Hobbies)</option>
              <option value="fact">Faktlar (Facts)</option>
              <option value="special">Maxsus Kartalar (Special)</option>
            </select>

            <span className="text-[11px] text-[#FBBF24] font-mono ml-auto">
              Jami: {filteredCards.length} ta karta ({chunkedPages.length} ta A4 varaq)
            </span>
          </div>
        )}
      </div>

      {/* ================= 1. TAB: A4 3x3 CARDS FRONT PRINT SHEETS ================= */}
      {activeTab === 'cards_a4' && (
        <div className="max-w-5xl mx-auto space-y-12 print:space-y-0">
          {chunkedPages.map((pageCards, pageIdx) => (
            <div 
              key={pageIdx} 
              className="bg-white text-slate-900 p-6 rounded-3xl print:rounded-none print:p-4 shadow-2xl print:shadow-none break-after-page page-a4 border-2 border-slate-300 print:border-none"
              style={{ minHeight: '297mm', width: '100%', maxWidth: '210mm', margin: '0 auto' }}
            >
              {/* Sheet Header info */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-200 mb-3 print:mb-2">
                <span>BOSHPANA STOL O'YINI — A4 KARTA BOSMA TERIMI (3x3 GRID)</span>
                <span>VARAQ {pageIdx + 1} / {chunkedPages.length} (OLDI TOMON)</span>
              </div>

              {/* 3x3 Card Grid (63.5 x 88.9 mm Standard Playing Card Size) */}
              <div className="grid grid-cols-3 gap-2.5 print:gap-1 items-center justify-center">
                {pageCards.map((card) => (
                  <div key={card.id} className="relative p-0.5 border border-dashed border-slate-300 print:border-slate-400 rounded-xl overflow-hidden bg-[#07080c]">
                    <CharacterCard
                      category={card.category}
                      card={card}
                      isRevealed={true}
                      isOwner={true}
                      canReveal={false}
                    />
                    {/* Crop marks in corners */}
                    <span className="absolute top-0 left-0 text-[8px] text-slate-400 font-mono pointer-events-none">+</span>
                    <span className="absolute top-0 right-0 text-[8px] text-slate-400 font-mono pointer-events-none">+</span>
                    <span className="absolute bottom-0 left-0 text-[8px] text-slate-400 font-mono pointer-events-none">+</span>
                    <span className="absolute bottom-0 right-0 text-[8px] text-slate-400 font-mono pointer-events-none">+</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 2. TAB: A4 3x3 CARDS BACK (KO'YLAK) ================= */}
      {activeTab === 'card_backs' && (
        <div className="max-w-5xl mx-auto space-y-12 print:space-y-0">
          {chunkedPages.map((_, pageIdx) => (
            <div 
              key={pageIdx} 
              className="bg-white text-slate-900 p-6 rounded-3xl print:rounded-none print:p-4 shadow-2xl print:shadow-none break-after-page page-a4 border-2 border-slate-300 print:border-none"
              style={{ minHeight: '297mm', width: '100%', maxWidth: '210mm', margin: '0 auto' }}
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-200 mb-3 print:mb-2">
                <span>BOSHPANA STOL O'YINI — DUPLEX ORQA TOMON TERIMI (3x3 GRID)</span>
                <span>VARAQ {pageIdx + 1} / {chunkedPages.length} (KARTA KO'YLAGI)</span>
              </div>

              {/* 3x3 Card Backs Grid */}
              <div className="grid grid-cols-3 gap-2.5 print:gap-1 items-center justify-center">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-[2/3] max-w-[280px] w-full rounded-2xl bg-gradient-to-br from-[#07080c] via-[#12151d] to-[#07080c] border-2 border-[#FBBF24]/80 p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-md text-center"
                  >
                    {/* Retro Vault-Bek Emblem */}
                    <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#FBBF24] uppercase">
                      <span>BOSHPANA</span>
                      <span>2055</span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-[#FBBF24]/10 border-2 border-[#FBBF24] flex items-center justify-center shadow-inner my-auto">
                      <div className="text-2xl animate-pulse">☢️</div>
                    </div>

                    <div className="w-full text-center">
                      <span className="text-xs font-black uppercase text-[#FBBF24] tracking-widest block">
                        BOSHPANA
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 block">
                        KIM OMON QOLADI?
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 3. TAB: A5 PRINTABLE ILLUSTRATED RULEBOOK ================= */}
      {activeTab === 'rulebook_a5' && (
        <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 text-slate-900">
          
          {/* Booklet Page 1: Cover */}
          <div className="bg-[#FEF3C7] p-8 sm:p-12 rounded-3xl border-4 border-[#FBBF24] shadow-2xl break-after-page text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-[#0d1117] border-4 border-[#FBBF24] flex items-center justify-center text-4xl mx-auto shadow-xl">
              ☢️
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#0d1117]">
                BOSHPANA
              </h1>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-[#DC2626]">
                Kim Omon Qoladi? — Rasmiy O'yin Qoidalari
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-amber-900/20 max-w-md mx-auto text-xs text-slate-700 space-y-1.5">
              <div className="font-bold">👥 Ishtirokchilar: 3 tadan 16 tagacha o'yinchi</div>
              <div className="font-bold">⏱ Davomiyligi: 30 – 60 daqiqa</div>
              <div className="font-bold">🎂 Yosh chegarasi: 14+ yosh</div>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto italic">
              "Global falokatdan so'ng faqat eng kuchli, ayyor va bir-birini to'ldiruvchi guruh boshpanada omon qoladi!"
            </p>
          </div>

          {/* Booklet Page 2: Gameplay Lore & Setup */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl break-after-page space-y-5 text-xs text-slate-800 leading-relaxed">
            <h3 className="text-base font-black uppercase text-[#1E40AF] border-b-2 border-slate-200 pb-2">
              1. O'YIN TAYYORGARLIGI VA TARQATISH
            </h3>
            
            <p>
              <b>1. Falokatni Tanlash:</b> Stol o'rtasiga 8 ta Falokat kartasidan bittasi ochiq holda qo'yiladi. Falokat shartlari (boshpanada yashash oylari va asosiy xavflar) barchaga o'qib eshittiriladi.
            </p>
            <p>
              <b>2. Boshpana Sig'imi:</b> Boshpanaga jami o'yinchilarning <b>atigi 30-40 foizi</b> (masalan: 6 kishidan 2 nafari, 10 kishidan 3 nafari) kira oladi.
            </p>
            <p>
              <b>3. Kartalar Tarqatish:</b> Har bir o'yinchiga 7 ta toifadan 1 tadan karta yopiq holda beriladi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><b>🩺 Kasb (Profession):</b> Mutaxassislik va boshpanadagi asosiy vazifa.</li>
              <li><b>🧬 Biologiya (Biology):</b> Yoshi, jinsi, jismoniy kuchi va nasl berish salohiyati.</li>
              <li><b>💚 Salomatlik (Health):</b> Immunitet yoki surunkali xastalik.</li>
              <li><b>🎒 Bagaj (Baggage):</b> O'zi bilan olib kirgan muhim qurol, ozuqa yoki asbob.</li>
              <li><b>✨ Xobbi (Hobby):</b> Qo'shimcha foydali hunar.</li>
              <li><b>📜 Fakt (Fact):</b> Yashirin o'tmish yoki favqulodda bilim.</li>
              <li><b>⚡ Maxsus Qobiliyat:</b> O'yin qoidalarini o'zgartiruvchi kuch (Veto, Rokirovka va h.k.).</li>
            </ul>
          </div>

          {/* Booklet Page 3: Round Structure & Voting */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl break-after-page space-y-5 text-xs text-slate-800 leading-relaxed">
            <h3 className="text-base font-black uppercase text-[#DC2626] border-b-2 border-slate-200 pb-2">
              2. RAUNDLAR KETMA-KETLIGI VA OVOZ BERISH
            </h3>

            <p>
              <b>1-Raund (Kasblar Jangi):</b> Har bir o'yinchi navbat bilan faqat o'zining <b>Kasb</b> kartasini ochadi va 60 soniya ichida nega aynan u boshpanaga kerakligini isbotlaydi.
            </p>
            <p>
              <b>2-Raund va Keyingi Raundlar:</b> O'yinchi qolgan yashirin kartalaridan birini (Biologiya, Bagaj, Xobbi va h.k.) <b>o'z ixtiyoriga ko'ra tanlab ochadi</b> va himoya nutqi so'zlaydi.
            </p>
            <p>
              <b>Muhokama va Bahs (60 soniya):</b> Barcha kartalar ochilgach, davrada umumiy tortishuv boshlanadi — kim eng keraksiz yoki xavfli ekani aniqlanadi.
            </p>
            <p>
              <b>Ovoz Berish va Chiqarib Yuborish:</b> Barcha ishtirokchilar 3-2-1 hisobi bilan bir vaqtda barmoq bilan kimni chiqarishni ko'rsatadi. Eng ko'p ovoz olgan o'yinchi boshpanadan chiqariladi!
            </p>
            <p>
              <b>Kutilmagan Bunker Hodisasi:</b> Har raund oralig'ida kutilmagan hodisa (dori ombori, kalamushlar, suv yorilishi) sodir bo'ladi.
            </p>
          </div>

          {/* Booklet Page 4: Final Simulation & Victory */}
          <div className="bg-[#FEF3C7] p-8 sm:p-10 rounded-3xl border-4 border-[#FBBF24] shadow-2xl break-after-page space-y-5 text-xs text-slate-800 leading-relaxed">
            <h3 className="text-base font-black uppercase text-[#0d1117] border-b-2 border-amber-900/20 pb-2 flex items-center gap-2">
              <Trophy size={18} className="text-[#FBBF24]" /> 3. G'ALABA VA YAKUNIY SIMULYATSIYA
            </h3>

            <p>
              Boshpanada belgilangan o'rinlar soniga teng o'yinchilar qolganda, o'yin to'xtatiladi. Qolgan mutaxassislarning umumiy ballari hisoblanadi:
            </p>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10">🍞 Oziq-ovqat Ta'minoti</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10">💊 Tibbiy Xavfsizlik</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10">⚡ Texnik Barqarorlik</div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10">🛡️ Tashqi Himoya & Ruhiyat</div>
            </div>

            <p className="font-bold text-[#DC2626]">
              Agar omon qolganlar guruhi falokatning barcha xavflarini bartaraf eta olsa — jamoa G'ALABA qozonadi va yangi insoniyat sivilizatsiyasini tiklaydi!
            </p>

            <div className="pt-4 border-t border-amber-900/20 flex items-center justify-between text-[10px] text-slate-600">
              <span>Muallif: @emokred</span>
              <span>Rasmiy Bot: @boshpana_gamebot</span>
            </div>
          </div>

        </div>
      )}

      {/* ================= 4. TAB: BOX PACKAGING MOCKUP & DIE-LINES ================= */}
      {activeTab === 'box_packaging' && (
        <div className="max-w-4xl mx-auto bg-[#161b22] border-4 border-[#FBBF24] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-[#FEF3C7]">
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black uppercase text-[#FBBF24]">📦 BOSHPANA: STANDART QUTI MAKETI (BOX WRAP)</h2>
            <p className="text-xs text-slate-400 font-mono">Qattiq Quti O'lchami: 150 x 200 x 45 mm (2 qismli qopqoqli quti)</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#07080c] border-2 border-[#FBBF24]/60 text-center space-y-5">
            <div className="w-24 h-24 rounded-full bg-[#FBBF24]/20 border-4 border-[#FBBF24] flex items-center justify-center text-4xl mx-auto">
              ☢️
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              BOSHPANA
            </h1>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#FBBF24]">
              Apokalipsis Ijtimoiy Stol O'yini
            </h3>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs font-mono font-bold text-slate-300">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">👥 3–16 kishi</div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">⏱ 45 daqiqa</div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">🔞 14+ yosh</div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Qutining ichida: 130+ ta yuqori sifatli laklangan kartalar, 8 ta global falokat xaritasi, rangli qoidalar kitobchasi va xon-atlas dizaynli karta ko'ylagi.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
