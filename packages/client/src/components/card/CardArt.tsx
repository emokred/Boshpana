import React from 'react';
import { CardCategory } from '@boshpana/shared';
import {
  Briefcase, HeartPulse, Dna, Package, Sparkles, FileText, Zap,
  Stethoscope, Wrench, Shield, Terminal, Brain, BookOpen, FlaskConical,
  Hammer, Mountain, Utensils, Flame, Compass, Car, Users, Scissors,
  Calculator, Crosshair, Key, Heart, AlertTriangle, Eye, Droplets,
  Wine, Camera, Radio, Trophy, Skull, UserCheck, Activity, Award,
  BatteryCharging, RadioTower, TreePine, Lock, Coffee
} from 'lucide-react';

interface CardArtProps {
  cardId?: string;
  category: CardCategory;
  title: string;
  color: string;
  isRevealed: boolean;
}

export const CardArt: React.FC<CardArtProps> = ({ cardId = '', category, title, color, isRevealed }) => {
  const t = title.toLowerCase();

  // Helper to render an icon or custom SVG graphic with styled glow
  const renderGraphic = () => {
    // KASB / OCCUPATION
    if (category === 'profession') {
      if (t.includes('xirurg') || t.includes('jarroh') || t.includes('shifokor')) return <Stethoscope className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('muhandis') || t.includes('santexnik') || t.includes('quruvchi')) return <Wrench className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('taksist') || t.includes('haydovchi')) return <Car className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('oshpaz') || t.includes('osh pazi') || t.includes('restoran')) return <Utensils className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('dasturchi') || t.includes('kiber') || t.includes('xaker')) return <Terminal className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('harbiy') || t.includes('ofitser') || t.includes('askari')) return <Shield className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('svarkachi') || t.includes('payvandchi')) return <Flame className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('mahalla') || t.includes('raisi')) return <Users className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('psixoterapevt') || t.includes('psixolog')) return <Brain className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('kimyogar') || t.includes('biolog')) return <FlaskConical className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('o\'qituvchi') || t.includes('domla')) return <BookOpen className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('sartarosh')) return <Scissors className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('qassob')) return <Crosshair className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('buxgalter')) return <Calculator className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('qutqaruvchi') || t.includes('o\'t o\'chiruvchi')) return <Flame className="w-16 h-16 sm:w-20 sm:h-20" />;
      return <Briefcase className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // BIOLOGIYA / IDENTITY
    if (category === 'biology') {
      if (t.includes('erkak')) {
        return (
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="14" r="5" />
              <line x1="19" y1="5" x2="13.6" y2="10.4" />
              <line x1="19" y1="5" x2="14" y2="5" />
              <line x1="19" y1="5" x2="19" y2="10" />
            </svg>
          </div>
        );
      }
      if (t.includes('ayol')) {
        return (
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="5" />
              <line x1="12" y1="14" x2="12" y2="21" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
          </div>
        );
      }
      return <Dna className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // SALOMATLIK / HEALTH
    if (category === 'health') {
      if (t.includes('sog\'lom') || t.includes('temir')) return <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-current opacity-80" />;
      if (t.includes('diabet') || t.includes('astma') || t.includes('ko\'r')) return <HeartPulse className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('klostrofobiya') || t.includes('asab') || t.includes('uyqusizlik')) return <Brain className="w-16 h-16 sm:w-20 sm:h-20" />;
      return <Activity className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // BAGAJ / BELONGINGS
    if (category === 'baggage') {
      if (t.includes('miltiq') || t.includes('qurol')) return <Crosshair className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('aptechka') || t.includes('dori')) return <HeartPulse className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('samovar') || t.includes('choynak')) return <Coffee className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('non') || t.includes('kishmish') || t.includes('qozon')) return <Utensils className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('generator') || t.includes('svarka') || t.includes('asboblar')) return <BatteryCharging className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('suv') || t.includes('filtr')) return <Droplets className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('viski') || t.includes('spirt')) return <Wine className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('dron')) return <Camera className="w-16 h-16 sm:w-20 sm:h-20" />;
      return <Package className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // XOBBI / INTERESTS
    if (category === 'hobby') {
      if (t.includes('karate') || t.includes('jang')) return <Shield className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('gitara') || t.includes('qo\'shiq')) return <Sparkles className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('radio') || t.includes('morze')) return <RadioTower className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('shaxmat')) return <Trophy className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('qulf') || t.includes('ochish')) return <Key className="w-16 h-16 sm:w-20 sm:h-20" />;
      return <Sparkles className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // FAKT / FACTS
    if (category === 'fact') {
      if (t.includes('agent') || t.includes('sir')) return <Eye className="w-16 h-16 sm:w-20 sm:h-20" />;
      if (t.includes('chizma') || t.includes('parol')) return <Key className="w-16 h-16 sm:w-20 sm:h-20" />;
      return <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    // MAXSUS / SPECIAL
    if (category === 'special') {
      return <Zap className="w-16 h-16 sm:w-20 sm:h-20" />;
    }

    return <Sparkles className="w-16 h-16 sm:w-20 sm:h-20" />;
  };

  return (
    <div className="relative w-full h-32 sm:h-36 flex items-center justify-center overflow-hidden my-1 rounded-xl bg-gradient-to-b from-bunker-950/90 to-bunker-900/90 border border-slate-800/80 shadow-inner">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-xl pointer-events-none rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Decorative Traditional Archway Silhouette */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 160 120" preserveAspectRatio="none" fill="none">
        <path d="M 20,120 V 50 Q 20,10 80,10 Q 140,10 140,50 V 120" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="80" cy="10" r="4" fill={color} />
      </svg>

      {/* Center Thematic Graphic Icon */}
      <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]`} style={{ color }}>
        {renderGraphic()}
      </div>
    </div>
  );
};
