export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  eliminations: number;
  specialCardsUsed: number;
  consecutiveWins: number;
  favoriteProfession: string;
  unlockedBadgeIds: string[];
  lastUpdated: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'survival' | 'negotiation' | 'social' | 'special';
  requiredCount?: number;
}

export const ACHIEVEMENTS_LIST: AchievementBadge[] = [
  {
    id: 'badge-first-survival',
    title: 'Ilk Omon Qolish',
    description: 'Ilk bor boshpanaga kirib g\'olib bo\'ling.',
    icon: '🏆',
    category: 'survival'
  },
  {
    id: 'badge-negotiator',
    title: 'Ayyor Muzokarachi',
    description: 'Birorta ham sizga qarshi ovoz olmasdan omon qoling.',
    icon: '🗣️',
    category: 'negotiation'
  },
  {
    id: 'badge-master-doctor',
    title: 'Xalq Qahramoni',
    description: 'Shifokor yoki Kimyogar bo\'lib boshpanani epidemiyadan qutqaring.',
    icon: '🩺',
    category: 'social'
  },
  {
    id: 'badge-bluff-king',
    title: 'Bluff Qiroli',
    description: 'Og\'ir kasallik yoki salbiy karta bilan ham boshpanaga kirishga erishing.',
    icon: '🎭',
    category: 'negotiation'
  },
  {
    id: 'badge-special-tactician',
    title: 'Taktik Daho',
    description: 'O\'yin davomida 3 marta Maxsus qobiliyat kartalaridan unumli foydalaning.',
    icon: '⚡',
    category: 'special'
  },
  {
    id: 'badge-bunker-legend',
    title: 'Boshpana Afsonasi',
    description: 'Ketma-ket 3 ta o\'yinda g\'alaba qozoning.',
    icon: '👑',
    category: 'survival'
  }
];

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  eliminations: 0,
  specialCardsUsed: 0,
  consecutiveWins: 0,
  favoriteProfession: 'Noma\'lum',
  unlockedBadgeIds: [],
  lastUpdated: Date.now()
};

export class StatsService {
  private static STORAGE_KEY = 'boshpana_player_stats';

  public static getStats(): PlayerStats {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
    } catch {}
    return DEFAULT_STATS;
  }

  public static recordGameEnd(isWon: boolean, professionTitle?: string): { stats: PlayerStats; newlyUnlocked: AchievementBadge[] } {
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    if (isWon) {
      stats.gamesWon += 1;
      stats.consecutiveWins += 1;
    } else {
      stats.eliminations += 1;
      stats.consecutiveWins = 0;
    }

    if (professionTitle) {
      stats.favoriteProfession = professionTitle;
    }

    const newlyUnlocked: AchievementBadge[] = [];

    // Check unlocks
    if (stats.gamesWon >= 1 && !stats.unlockedBadgeIds.includes('badge-first-survival')) {
      stats.unlockedBadgeIds.push('badge-first-survival');
      newlyUnlocked.push(ACHIEVEMENTS_LIST.find(b => b.id === 'badge-first-survival')!);
    }

    if (stats.consecutiveWins >= 3 && !stats.unlockedBadgeIds.includes('badge-bunker-legend')) {
      stats.unlockedBadgeIds.push('badge-bunker-legend');
      newlyUnlocked.push(ACHIEVEMENTS_LIST.find(b => b.id === 'badge-bunker-legend')!);
    }

    if (stats.gamesPlayed >= 5 && !stats.unlockedBadgeIds.includes('badge-negotiator')) {
      stats.unlockedBadgeIds.push('badge-negotiator');
      newlyUnlocked.push(ACHIEVEMENTS_LIST.find(b => b.id === 'badge-negotiator')!);
    }

    stats.lastUpdated = Date.now();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));

    return { stats, newlyUnlocked };
  }

  public static getRankTitle(wins: number): { title: string; color: string; level: number } {
    if (wins >= 25) return { title: '👑 Boshpana Afsonasi (Grandmaster)', color: 'text-amber-400', level: 5 };
    if (wins >= 15) return { title: '🎖️ Bunker Faxriysi (Veteran)', color: 'text-purple-400', level: 4 };
    if (wins >= 7) return { title: '🛡️ Tajribali Omon Qoluvchi (Survivor)', color: 'text-emerald-400', level: 3 };
    if (wins >= 2) return { title: '⚡ Qat\'iyatli Qochqin (Scout)', color: 'text-cyan-400', level: 2 };
    return { title: '🌱 Yangi Boshlovchi (Rookie)', color: 'text-slate-400', level: 1 };
  }
}
