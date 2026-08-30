import React, { useState, useEffect } from 'react';
import { 
  CardCategory, CardItem, Catastrophe, DeckTheme, CARDS_DATA, CATASTROPHES 
} from '@boshpana/shared';
import { CharacterCard } from '../card/CharacterCard';
import { 
  Sparkles, Plus, Trash2, Download, Upload, Copy, Check, 
  ArrowLeft, Palette, Shield, Heart, Zap, Coffee, Brain, 
  Flame, Skull, AlertTriangle, Image as ImageIcon, RefreshCw
} from 'lucide-react';
import { sound } from '../../services/sound';

// Preset Vault-Bek Retro-Mascot Uzbek Avatar Options
const VAULT_BEK_AVATARS = [
  { id: 'vb_doctor', name: '🩺 Vault-Shifokor (Do\'ppili)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80' },
  { id: 'vb_engineer', name: '⚡ Vault-Usta (Payvandchi)', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80' },
  { id: 'vb_chef', name: '🍲 Vault-Oshpaz (Choponli)', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80' },
  { id: 'vb_elder', name: '👴 Vault-Oqsoqol (Nasihatgo\'y)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { id: 'vb_warrior', name: '🛡️ Vault-Polvon (Kurashchi)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'vb_scientist', name: '🧬 Vault-Olima (Genetik)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' }
];

export const DeckStudioView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'create_card' | 'create_catastrophe' | 'my_deck'>('create_card');

  // Custom Cards Stored in LocalStorage
  const [customCards, setCustomCards] = useState<CardItem[]>(() => {
    try {
      const saved = localStorage.getItem('boshpana_custom_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom Catastrophes
  const [customCatastrophes, setCustomCatastrophes] = useState<Catastrophe[]>(() => {
    try {
      const saved = localStorage.getItem('boshpana_custom_catastrophes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Card Form State
  const [cardCategory, setCardCategory] = useState<CardCategory>('profession');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardTheme, setCardTheme] = useState<DeckTheme>('uzbek');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(VAULT_BEK_AVATARS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Impact Scores
  const [scoreFood, setScoreFood] = useState(0);
  const [scoreMed, setScoreMed] = useState(0);
  const [scoreTech, setScoreTech] = useState(0);
  const [scoreDef, setScoreDef] = useState(0);
  const [scorePsych, setScorePsych] = useState(0);

  // Special Action Type
  const [specialActionType, setSpecialActionType] = useState<'cancel_vote' | 'swap_profession' | 'add_shelter_slot' | 'steal_baggage' | 'force_reveal' | 'extra_vote' | 'heal_condition' | 'immunity'>('cancel_vote');

  // Catastrophe Form State
  const [catTitle, setCatTitle] = useState('');
  const [catShortDesc, setCatShortDesc] = useState('');
  const [catFullStory, setCatFullStory] = useState('');
  const [catMonths, setCatMonths] = useState(24);
  const [catHazards, setCatHazards] = useState('Radiatsiya, Sovuq, Suv muzlashi');
  const [catSkills, setCatSkills] = useState<('food' | 'medical' | 'tech' | 'defense' | 'psychology')[]>(['food', 'tech', 'defense']);

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState(false);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('boshpana_custom_cards', JSON.stringify(customCards));
  }, [customCards]);

  useEffect(() => {
    localStorage.setItem('boshpana_custom_catastrophes', JSON.stringify(customCatastrophes));
  }, [customCatastrophes]);

  // Live Card Preview Object
  const previewCard: CardItem = {
    id: 'preview_card',
    category: cardCategory,
    title: cardTitle.trim() || (cardCategory === 'profession' ? 'Malikadagi Usta' : 'Noyob Karta'),
    description: cardDesc.trim() || 'Karta haqida qisqacha ma\'lumot va xususiyatlari shu yerda ko\'rinadi.',
    theme: cardTheme,
    artworkUrl: customImageUrl.trim() || selectedAvatarUrl,
    impactScore: {
      food: scoreFood,
      medical: scoreMed,
      tech: scoreTech,
      defense: scoreDef,
      psychology: scorePsych
    },
    specialAction: cardCategory === 'special' ? { type: specialActionType } : undefined
  };

  // Add Card
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    sound.playClick();
    const newCard: CardItem = {
      ...previewCard,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };

    setCustomCards([newCard, ...customCards]);
    setCardTitle('');
    setCardDesc('');
    setScoreFood(0);
    setScoreMed(0);
    setScoreTech(0);
    setScoreDef(0);
    setScorePsych(0);
    setActiveTab('my_deck');
  };

  // Add Catastrophe
  const handleSaveCatastrophe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    sound.playClick();
    const newCat: Catastrophe = {
      id: `cat_custom_${Date.now()}`,
      title: catTitle.trim(),
      shortDesc: catShortDesc.trim() || 'Kutilmagan global apokalipsis.',
      fullStory: catFullStory.trim() || catShortDesc.trim(),
      theme: 'uzbek',
      shelterMonths: catMonths,
      hazards: catHazards.split(',').map((h) => h.trim()).filter(Boolean),
      requiredSkills: catSkills
    };

    setCustomCatastrophes([newCat, ...customCatastrophes]);
    setCatTitle('');
    setCatShortDesc('');
    setCatFullStory('');
    setActiveTab('my_deck');
  };

  // Export Deck JSON
  const handleExportDeck = () => {
    sound.playClick();
    const exportData = {
      version: '1.0',
      title: 'Boshpana Maxsus To\'plami',
      cards: customCards,
      catastrophes: customCatastrophes
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boshpana_deck_${Date.now()}.json`;
    a.click();
  };

  // Import Deck JSON
  const handleImportDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cards && Array.isArray(parsed.cards)) {
          setCustomCards([...parsed.cards, ...customCards]);
        }
        if (parsed.catastrophes && Array.isArray(parsed.catastrophes)) {
          setCustomCatastrophes([...parsed.catastrophes, ...customCatastrophes]);
        }
        sound.playVictory();
        alert(`Muvaffaqiyatli yuklandi: ${parsed.cards?.length || 0} ta karta, ${parsed.catastrophes?.length || 0} ta falokat!`);
      } catch (err) {
        alert("Fayl formati noto'g'ri!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#FEF3C7] p-3 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Vault-Bek Top Banner */}
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
              <Palette className="text-[#DC2626]" size={22} />
              <span>Vault-Bek Karta & Falokat Studiyasi</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              1950-yillar Retro-Komiks & O'zbekona Xon-Atlas Uslubida O'z Kartangizni Yarating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#1E40AF]/30 border border-[#FBBF24]/50 text-xs font-bold text-[#FBBF24]">
            ✨ Maxsus Kartalar: {customCards.length} ta
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#161b22] border border-slate-800 text-xs font-black uppercase tracking-wider">
        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveTab('create_card'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'create_card' ? 'bg-[#FBBF24] text-[#0d1117] shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plus size={15} />
          <span>Yangi Karta</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveTab('create_catastrophe'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'create_catastrophe' ? 'bg-[#DC2626] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle size={15} />
          <span>Yangi Falokat</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.playClick(); setActiveTab('my_deck'); }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'my_deck' ? 'bg-[#1E40AF] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={15} />
          <span>Mening To'plamim ({customCards.length})</span>
        </button>
      </div>

      {/* ================= 1. TAB: CREATE CARD WITH LIVE 2:3 PREVIEW ================= */}
      {activeTab === 'create_card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-[#161b22] border-2 border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <h3 className="text-xs font-mono font-black uppercase text-[#FBBF24] tracking-widest flex items-center gap-2">
              <Plus size={16} /> 1. Karta Parametrlarini Kiritish:
            </h3>

            <form onSubmit={handleSaveCard} className="space-y-4">
              
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Karta Toifasi (Kategoriya):</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {(['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'] as CardCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { sound.playClick(); setCardCategory(cat); }}
                      className={`p-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                        cardCategory === cat
                          ? 'bg-[#FBBF24] text-[#0d1117] border-[#FBBF24] shadow-md font-bold'
                          : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat === 'profession' ? '🩺 Kasb' :
                       cat === 'biology' ? '🧬 Biologiya' :
                       cat === 'health' ? '💚 Salomatlik' :
                       cat === 'baggage' ? '🎒 Bagaj' :
                       cat === 'hobby' ? '✨ Xobbi' :
                       cat === 'fact' ? '📜 Fakt' : '⚡ Maxsus'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Karta Nomi:</label>
                <input
                  type="text"
                  required
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Masalan: Malikadagi iPhone Ustasi, Qashqadaryo Polvoni..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder-slate-600 text-xs font-bold focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Qisqacha Ta'rifi / Xususiyati:</label>
                <textarea
                  rows={2}
                  value={cardDesc}
                  onChange={(e) => setCardDesc(e.target.value)}
                  placeholder="Bunkerdagi vazifasi, nega kerakligi yoki kulgili zaifligi..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder-slate-600 text-xs font-medium focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              {/* Vault-Bek Avatar Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Vault-Bek Retro Avatarini Tanlang:</label>
                <div className="grid grid-cols-3 gap-2">
                  {VAULT_BEK_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedAvatarUrl(av.url);
                        setCustomImageUrl('');
                      }}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        selectedAvatarUrl === av.url && !customImageUrl
                          ? 'bg-[#1E40AF]/40 border-[#FBBF24] shadow-md'
                          : 'bg-[#0d1117] border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-[#FEF3C7] truncate">{av.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL Option */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-400 block">Yoki O'z Rasm Havolangizni Kiritish (URL):</label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/my-avatar.png"
                  className="w-full px-3 py-2 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-300 placeholder-slate-600 text-xs focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              {/* Impact Scores Sliders */}
              <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2.5">
                <div className="text-[11px] font-mono font-bold uppercase text-[#FBBF24] flex items-center justify-between">
                  <span>Bunker Ta'sir Ballari (-5 dan +5 gacha):</span>
                  <span className="text-[9px] text-slate-400">Algoritm hisobi</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">🍞 Oziq-ovqat: {scoreFood > 0 ? `+${scoreFood}` : scoreFood}</span>
                    <input type="range" min="-5" max="5" value={scoreFood} onChange={(e) => setScoreFood(Number(e.target.value))} className="w-full accent-[#FBBF24]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">💊 Tibbiyot: {scoreMed > 0 ? `+${scoreMed}` : scoreMed}</span>
                    <input type="range" min="-5" max="5" value={scoreMed} onChange={(e) => setScoreMed(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">⚡ Texnika: {scoreTech > 0 ? `+${scoreTech}` : scoreTech}</span>
                    <input type="range" min="-5" max="5" value={scoreTech} onChange={(e) => setScoreTech(Number(e.target.value))} className="w-full accent-cyan-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">🛡️ Himoya: {scoreDef > 0 ? `+${scoreDef}` : scoreDef}</span>
                    <input type="range" min="-5" max="5" value={scoreDef} onChange={(e) => setScoreDef(Number(e.target.value))} className="w-full accent-[#DC2626]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">🧠 Ruhiyat: {scorePsych > 0 ? `+${scorePsych}` : scorePsych}</span>
                    <input type="range" min="-5" max="5" value={scorePsych} onChange={(e) => setScorePsych(Number(e.target.value))} className="w-full accent-purple-500" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FBBF24] via-amber-500 to-[#DC2626] hover:from-amber-400 hover:to-red-600 text-[#0d1117] font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Kartani Saqlash va To'plamga Qo'shish</span>
              </button>
            </form>
          </div>

          {/* Right Preview: 5 cols */}
          <div className="lg:col-span-5 bg-[#161b22] border-2 border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-[#FBBF24] uppercase flex items-center gap-1.5">
                <Sparkles size={14} /> Jonli 2:3 Karta Ko'rinishi:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1E40AF]/40 text-[#FEF3C7] font-bold">
                Vault-Bek Retro
              </span>
            </div>

            <div className="w-full max-w-[260px] py-2">
              <CharacterCard
                category={previewCard.category}
                card={previewCard}
                isRevealed={true}
                isOwner={true}
                canReveal={false}
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-center text-[11px] text-slate-400 leading-relaxed">
              Ushbu karta siz yaratgan o'yin xonalarida, <b>Bitta Telefon</b> rejimida va Telegram botida darhol ishtirokchilarga tushishi mumkin!
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. TAB: CREATE CATASTROPHE ================= */}
      {activeTab === 'create_catastrophe' && (
        <div className="max-w-2xl mx-auto bg-[#161b22] border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 className="text-xs font-mono font-black uppercase text-[#DC2626] tracking-widest flex items-center gap-2">
            <AlertTriangle size={18} /> Yangi Falokat va Boshpana Shartlarini Yaratish:
          </h3>

          <form onSubmit={handleSaveCatastrophe} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-300 block">Falokat Nomi:</label>
              <input
                type="text"
                required
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
                placeholder="Masalan: Toshkent Metrosining Qulashi, Buyuk Qurg'oqchilik..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder-slate-600 text-xs font-bold focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-300 block">Qisqacha Ta'rifi (1-2 gap):</label>
              <input
                type="text"
                required
                value={catShortDesc}
                onChange={(e) => setCatShortDesc(e.target.value)}
                placeholder="Dunyoda nima yuz bergani va nima uchun bunkerga yashirinish kerakligi..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder-slate-600 text-xs font-medium focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Boshpanada Yashash Muddati (Oylar):</label>
                <input
                  type="number"
                  min="6"
                  max="120"
                  value={catMonths}
                  onChange={(e) => setCatMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-300 block">Asosiy Xavflar (vergul bilan):</label>
                <input
                  type="text"
                  value={catHazards}
                  onChange={(e) => setCatHazards(e.target.value)}
                  placeholder="Radiatsiya, Suv tanqisligi, Mutatsiyalar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#DC2626] to-amber-600 hover:from-red-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Falokatni Saqlash</span>
            </button>
          </form>
        </div>
      )}

      {/* ================= 3. TAB: MY CUSTOM DECK ================= */}
      {activeTab === 'my_deck' && (
        <div className="space-y-5">
          {/* Deck Action Bar */}
          <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase text-[#FBBF24]">Siz Yaratgan Maxsus Kartalar ({customCards.length} ta)</h3>
              <p className="text-[10px] text-slate-400 font-mono">Ushbu kartalar brauzeringizda xavfsiz saqlanadi va o'yiningizga qo'shiladi</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportDeck}
                disabled={customCards.length === 0}
                className="px-3 py-2 rounded-xl bg-[#1E40AF]/40 hover:bg-[#1E40AF] border border-[#1E40AF] text-[#FEF3C7] text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                <Download size={14} />
                <span>Eksport (JSON)</span>
              </button>

              <label className="px-3 py-2 rounded-xl bg-[#FBBF24]/20 hover:bg-[#FBBF24]/30 border border-[#FBBF24] text-[#FBBF24] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload size={14} />
                <span>Import Qilish</span>
                <input type="file" accept=".json" onChange={handleImportDeck} className="hidden" />
              </label>
            </div>
          </div>

          {/* Cards Grid */}
          {customCards.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#161b22] border-2 border-dashed border-slate-800 text-center space-y-3">
              <Palette size={36} className="text-[#FBBF24]/50 mx-auto animate-pulse" />
              <h4 className="text-sm font-black uppercase text-slate-300">Hozircha maxsus kartalar yaratilmagan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                "Yangi Karta" bo'limiga o'tib, o'zingizning do'stlaringiz va mahallangizga xos qiziqarli kartalarni yarating!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('create_card')}
                className="px-5 py-2.5 rounded-xl bg-[#FBBF24] text-[#0d1117] font-black text-xs uppercase"
              >
                + 1-Kartani Yaratish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {customCards.map((c) => (
                <div key={c.id} className="relative group">
                  <CharacterCard
                    category={c.category}
                    card={c}
                    isRevealed={true}
                    isOwner={true}
                    canReveal={false}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCustomCards(customCards.filter((card) => card.id !== c.id));
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/90 text-red-400 border border-red-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="O'chirish"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
