import { 
  GameRoomState, Player, RoomSettings, CardCategory, 
  SimulationResult, Catastrophe, ShelterSpecs, PlayerCardSlot,
  BunkerEvent
} from '@boshpana/shared';
import { CATASTROPHES, SHELTER_SPECS_PRESETS, CARDS_DATA, BUNKER_EVENTS } from '@boshpana/shared';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class LocalGameEngine {
  private state: GameRoomState;
  private timerInterval: any = null;
  private onStateChange: (state: GameRoomState) => void;

  constructor(hostName: string, onStateChange: (state: GameRoomState) => void, initialSettings?: Partial<RoomSettings>) {
    this.onStateChange = onStateChange;

    const hostId = 'player-host-' + Math.random().toString(36).substring(2, 7);
    const roomCode = 'BOSH-' + Math.floor(100 + Math.random() * 900);

    const defaultSettings: RoomSettings = {
      maxPlayers: 8,
      targetSurvivors: 2,
      votingMode: 'open',
      finalSimulation: true,
      turnDurationSec: 45,
      debateDurationSec: 60,
      selectedDecks: ['classic', 'uzbek'],
      allowSpecialCards: true,
      excludedCardIds: [],
      ...initialSettings
    };

    this.state = {
      roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      hostId,
      phase: 'LOBBY',
      roundNumber: 1,
      currentSpeakerIndex: 0,
      activeSpeakerPlayerId: null,
      phaseTimeRemainingSec: 0,
      isTimerPaused: false,
      catastrophe: null,
      shelterSpecs: null,
      currentBunkerEvent: null,
      players: {},
      playerOrder: [],
      settings: defaultSettings,
      eliminatedPlayerIds: [],
      lastEliminatedPlayer: null,
      survivorPlayerIds: [],
      simulationResult: null,
      chatMessages: []
    };

    // Add Host player
    this.state.players[hostId] = {
      id: hostId,
      username: hostName.toLowerCase().replace(/\s+/g, '_'),
      displayName: hostName,
      isHost: true,
      isReady: true,
      isAlive: true,
      cards: {} as any,
      hasUsedSpecialCard: false,
      hasVoted: false,
      receivedVotesCount: 0
    };

    // Pre-populate with 3 demo bots by default so room has 4 players
    this.addDemoBot('Sardor (Bot)');
    this.addDemoBot('Nilufar (Bot)');
    this.addDemoBot('Jamshid (Bot)');

    this.state.playerOrder = Object.keys(this.state.players);
  }

  public getState(): GameRoomState {
    return this.state;
  }

  private broadcast() {
    this.onStateChange({ ...this.state });
  }

  public addDemoBot(botName?: string) {
    const playersList = Object.values(this.state.players);
    if (playersList.length >= this.state.settings.maxPlayers) return;

    const botId = 'player-bot-' + Math.random().toString(36).substring(2, 7);
    const names = ['Azizbek', 'Shaxlo', 'Bobur', 'Madina', 'Otabek', 'Dildora', 'Javohir', 'Guli'];
    const randomName = botName || `${names[Math.floor(Math.random() * names.length)]} (Bot)`;

    this.state.players[botId] = {
      id: botId,
      username: 'bot_' + Math.floor(Math.random() * 1000),
      displayName: randomName,
      isHost: false,
      isReady: true,
      isAlive: true,
      cards: {} as any,
      hasUsedSpecialCard: false,
      hasVoted: false,
      receivedVotesCount: 0
    };

    this.state.playerOrder = Object.keys(this.state.players);
    this.broadcast();
  }

  public removeDemoBot(botId: string) {
    if (this.state.players[botId] && !this.state.players[botId].isHost) {
      delete this.state.players[botId];
      this.state.playerOrder = Object.keys(this.state.players);
      this.broadcast();
    }
  }

  public toggleCardExclusion(cardId: string) {
    const current = this.state.settings.excludedCardIds || [];
    if (current.includes(cardId)) {
      this.state.settings.excludedCardIds = current.filter(id => id !== cardId);
    } else {
      this.state.settings.excludedCardIds = [...current, cardId];
    }
    this.broadcast();
  }

  public updateSettings(newSettings: Partial<RoomSettings>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.broadcast();
  }

  public setReady(playerId: string, isReady: boolean) {
    if (this.state.players[playerId]) {
      this.state.players[playerId].isReady = isReady;
      this.broadcast();
    }
  }

  public startGame() {
    const eligibleCatastrophes = CATASTROPHES.filter(c =>
      this.state.settings.selectedDecks.includes(c.theme)
    );
    this.state.catastrophe = eligibleCatastrophes[Math.floor(Math.random() * eligibleCatastrophes.length)] || CATASTROPHES[0];
    this.state.shelterSpecs = SHELTER_SPECS_PRESETS[Math.floor(Math.random() * SHELTER_SPECS_PRESETS.length)];

    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];
    const activeCards = CARDS_DATA.filter(c =>
      this.state.settings.selectedDecks.includes(c.theme) &&
      !this.state.settings.excludedCardIds?.includes(c.id)
    );

    const categoryDecks: Record<CardCategory, any[]> = {} as any;
    categories.forEach(cat => {
      categoryDecks[cat] = shuffle(activeCards.filter(c => c.category === cat));
    });

    Object.values(this.state.players).forEach(player => {
      player.isAlive = true;
      player.cards = {} as any;
      player.hasUsedSpecialCard = false;
      player.hasVoted = false;
      player.votedForPlayerId = null;
      player.receivedVotesCount = 0;

      categories.forEach(cat => {
        let card = categoryDecks[cat]?.pop();
        if (!card) {
          card = CARDS_DATA.find(c => c.category === cat) || {
            id: `${cat}-fallback`,
            category: cat,
            title: `Standart ${cat}`,
            theme: 'classic'
          };
        }
        player.cards[cat] = {
          category: cat,
          card,
          isRevealed: false
        };
      });
    });

    this.state.playerOrder = shuffle(Object.keys(this.state.players));
    this.state.roundNumber = 1;
    this.state.phase = 'DISASTER_INTRO';
    this.broadcast();
  }

  public startRoundsFromIntro() {
    this.state.phase = 'ROUND_PITCH';
    this.state.currentSpeakerIndex = 0;
    this.state.activeSpeakerPlayerId = this.state.playerOrder[0];
    this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;
    this.startTimer();
    this.broadcast();
  }

  public revealCard(playerId: string, category: CardCategory) {
    const player = this.state.players[playerId];
    if (!player || !player.isAlive) return;

    if (player.cards[category]) {
      player.cards[category].isRevealed = true;
      player.cards[category].revealedAtRound = this.state.roundNumber;

      this.addChatMessage({
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'TIZIM',
        text: `📢 ${player.displayName} o'zining [${category.toUpperCase()}] kartasini ochdi: "${player.cards[category].card.title}"`,
        timestamp: Date.now(),
        isSystem: true
      });

      this.broadcast();
    }
  }

  public nextSpeaker() {
    const alivePlayers = this.state.playerOrder.filter(id => this.state.players[id]?.isAlive);
    const currentAliveIndex = alivePlayers.indexOf(this.state.activeSpeakerPlayerId || '');

    // If bot was speaking and hasn't revealed card, auto reveal
    if (this.state.activeSpeakerPlayerId && this.state.activeSpeakerPlayerId.startsWith('player-bot-')) {
      const bot = this.state.players[this.state.activeSpeakerPlayerId];
      if (bot) {
        if (this.state.roundNumber === 1 && !bot.cards.profession.isRevealed) {
          this.revealCard(bot.id, 'profession');
        } else {
          const unrevealed = (['biology', 'health', 'baggage', 'hobby', 'fact'] as CardCategory[])
            .filter(cat => !bot.cards[cat]?.isRevealed);
          if (unrevealed.length > 0) {
            this.revealCard(bot.id, unrevealed[0]);
          }
        }
      }
    }

    if (currentAliveIndex >= 0 && currentAliveIndex < alivePlayers.length - 1) {
      this.state.activeSpeakerPlayerId = alivePlayers[currentAliveIndex + 1];
      this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;
      this.broadcast();
    } else {
      this.startDebatePhase();
    }
  }

  public startDebatePhase() {
    this.state.phase = 'ROUND_DEBATE';
    this.state.activeSpeakerPlayerId = null;
    this.state.phaseTimeRemainingSec = this.state.settings.debateDurationSec;
    this.broadcast();
  }

  public startVotingPhase() {
    this.state.phase = 'VOTING';
    this.state.phaseTimeRemainingSec = 30;

    Object.values(this.state.players).forEach(p => {
      p.hasVoted = false;
      p.votedForPlayerId = null;
      p.receivedVotesCount = 0;
    });

    this.broadcast();

    // Auto vote for demo bots after 2 seconds
    setTimeout(() => {
      const alive = Object.values(this.state.players).filter(p => p.isAlive);
      alive.forEach(bot => {
        if (bot.id.startsWith('player-bot-')) {
          const targets = alive.filter(t => t.id !== bot.id);
          if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            this.castVote(bot.id, target.id);
          }
        }
      });
    }, 1500);
  }

  public castVote(voterId: string, targetPlayerId: string) {
    if (this.state.phase !== 'VOTING') return;
    const voter = this.state.players[voterId];
    if (!voter || !voter.isAlive || voter.hasVoted) return;

    voter.hasVoted = true;
    voter.votedForPlayerId = targetPlayerId;

    const target = this.state.players[targetPlayerId];
    if (target) {
      target.receivedVotesCount = (target.receivedVotesCount || 0) + 1;
    }

    const aliveCount = Object.values(this.state.players).filter(p => p.isAlive).length;
    const votesCount = Object.values(this.state.players).filter(p => p.isAlive && p.hasVoted).length;

    this.broadcast();

    if (votesCount >= aliveCount) {
      setTimeout(() => {
        if (this.state.phase === 'VOTING') {
          this.resolveVoting();
        }
      }, 1500);
    }
  }

  public resolveVoting() {
    if (this.state.phase !== 'VOTING') return;
    const alivePlayers = Object.values(this.state.players).filter(p => p.isAlive);
    if (alivePlayers.length === 0) return;

    let maxVotes = 0;
    alivePlayers.forEach(p => {
      if ((p.receivedVotesCount || 0) > maxVotes) {
        maxVotes = p.receivedVotesCount || 0;
      }
    });

    const topCandidates = alivePlayers.filter(p => (p.receivedVotesCount || 0) === maxVotes && maxVotes > 0);
    let victim: Player | null = null;
    let isTie = false;

    if (topCandidates.length === 1) {
      victim = topCandidates[0];
    } else if (topCandidates.length > 1) {
      isTie = true;
      victim = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    } else {
      // If 0 votes cast across the board, pick randomly among alive
      victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    }

    if (victim) {
      (victim as Player).isAlive = false;
      this.state.eliminatedPlayerIds.push((victim as Player).id);

      // Open ALL unrevealed cards of the eliminated player for everyone to see!
      Object.keys((victim as Player).cards).forEach(k => {
        const slotKey = k as CardCategory;
        if ((victim as Player).cards[slotKey]) {
          (victim as Player).cards[slotKey].isRevealed = true;
        }
      });

      this.state.lastEliminatedPlayer = victim as Player;
      this.state.phase = 'VOTE_RESULTS';

      this.addChatMessage({
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'TIZIM',
        text: isTie 
          ? `⚖️ Durang! Tasodifiy tanlov natijasida ${(victim as Player).displayName} boshpanadan chiqarib yuborildi! Uning barcha kartalari ochilmoqda...`
          : `⚖️ Ko'pchilik ovozi bilan (${maxVotes} ovoz) ${(victim as Player).displayName} boshpanadan chiqarib yuborildi! Uning barcha kartalari ochilmoqda...`,
        timestamp: Date.now(),
        isSystem: true
      });
    }

    this.broadcast();
  }

  public continueFromVoteResults() {
    const remainingAlive = Object.values(this.state.players).filter(p => p.isAlive);

    // Check if remaining survivors equal target survivors count!
    if (remainingAlive.length <= this.state.settings.targetSurvivors) {
      this.state.survivorPlayerIds = remainingAlive.map(p => p.id);
      this.calculateFinalSimulation();
    } else {
      // Trigger surprise Bunker Discovery Event before next round!
      this.triggerBunkerEvent();
    }
  }

  public triggerBunkerEvent() {
    const randomEvent = BUNKER_EVENTS[Math.floor(Math.random() * BUNKER_EVENTS.length)];
    this.state.currentBunkerEvent = randomEvent;
    this.state.phase = 'BUNKER_EVENT';
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Apply event effects if any
    if (randomEvent.effect?.addShelterSlot) {
      this.state.settings.targetSurvivors += randomEvent.effect.addShelterSlot;
    }

    this.broadcast();
  }

  public acknowledgeEvent() {
    this.state.roundNumber += 1;
    this.state.currentBunkerEvent = null;
    this.state.phase = 'ROUND_PITCH';
    const alivePlayers = this.state.playerOrder.filter(id => this.state.players[id]?.isAlive);
    this.state.activeSpeakerPlayerId = alivePlayers[0] || null;
    this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;
    this.startTimer();
    this.broadcast();
  }

  public calculateFinalSimulation() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const survivors = Object.values(this.state.players).filter(p => p.isAlive);
    
    // Check if host turned OFF final simulation (Classic Mafia Mode: survival = win!)
    if (!this.state.settings.finalSimulation) {
      const result: SimulationResult = {
        isSuccess: true,
        survivalScore: 100,
        mode: 'CLASSIC_MAFIA_SURVIVAL',
        headline: '🎉 TABRIKLAYMIZ! BOSHPANADA OMON QOLDINGIZ!',
        detailedStory: `Klassik rejim: ${survivors.length} nafar omon qoluvchi so'nggi ovoz berish raundlaridan muvaffaqiyatli o'tib, boshpanadagi xavfsiz o'rinlarni egalladi. G'alaba!`,
        breakdown: {
          foodStatus: 'abundance',
          healthStatus: 'healthy',
          technicalStatus: 'flourishing',
          psychologicalStatus: 'peaceful',
          defenseStatus: 'secured'
        },
        survivors: survivors.map(s => ({
          id: s.id,
          displayName: s.displayName,
          profession: s.cards.profession?.card?.title || 'Kasbi noma\'lum',
          status: 'Omon qoldi (G\'olib)'
        }))
      };

      this.state.simulationResult = result;
      this.state.phase = 'FINAL_SIMULATION';
      this.broadcast();
      return;
    }

    // Hardcore Simulation Calculation:
    let foodScore = 0;
    let medScore = 0;
    let techScore = 0;
    let defenseScore = 0;
    let psychScore = 0;

    let maleCount = 0;
    let femaleCount = 0;
    let hasEmbryos = false;

    survivors.forEach(p => {
      // Check Biology & Gender for reproduction
      const bioText = ((p.cards.biology?.card?.title || '') + ' ' + (p.cards.biology?.card?.description || '')).toLowerCase();
      const bagText = ((p.cards.baggage?.card?.title || '') + ' ' + (p.cards.baggage?.card?.description || '')).toLowerCase();
      
      if (bioText.includes('ayol') || bioText.includes('qiz') || bioText.includes('female')) {
        femaleCount++;
      } else {
        maleCount++;
      }

      if (bagText.includes('embrion') || bagText.includes('urug\'') || bagText.includes('genetika') || bagText.includes('inkubator')) {
        hasEmbryos = true;
      }

      Object.values(p.cards).forEach(slot => {
        if (slot.card?.impactScore) {
          foodScore += slot.card.impactScore.food || 0;
          medScore += slot.card.impactScore.medical || 0;
          techScore += slot.card.impactScore.tech || 0;
          defenseScore += slot.card.impactScore.defense || 0;
          psychScore += slot.card.impactScore.psychology || 0;
        }
      });
    });

    const isFoodOk = foodScore >= 0;
    const isMedOk = medScore >= 0;
    const isTechOk = techScore >= 0;
    const isPsychOk = psychScore >= 0;
    const isDefenseOk = defenseScore >= 0;

    // Biology Reproduction Rule:
    const isReproductionOk = (maleCount > 0 && femaleCount > 0) || hasEmbryos;
    const reproductionStatus = (maleCount > 0 && femaleCount > 0)
      ? 'fertile_pair'
      : hasEmbryos
      ? 'embryo_bank'
      : 'failed_single_gender';

    // Global Success Check:
    const isSuccess = isFoodOk && isMedOk && isTechOk && isPsychOk && isDefenseOk && isReproductionOk;

    let headline = '';
    let detailedStory = '';
    let calculatedScore = 0;

    if (isSuccess) {
      calculatedScore = Math.min(100, Math.max(80, 80 + (foodScore + medScore + techScore + psychScore + defenseScore) * 3));
      headline = '🎉 BOSHPATHA AHLI OMON QOLDI VA YANGI SIVILIZATSIYANI TIKLADI!';
      detailedStory = `Mukammal guruh! ${survivors.length} nafar omon qoluvchi professional bilimlari, resurslarni to'g'ri taqsimlashi va nasl davomiyligi (${reproductionStatus === 'embryo_bank' ? 'Embrionlar banki yordamida' : 'Erkak va Ayol juftligi orqali'}) evaziga ${this.state.catastrophe?.shelterMonths || 24} oylik apokalipsisni muvaffaqiyatli yengib o'tdi!`;
    } else {
      // Pinpoint exact failure reason and set realistic low score (0-35%)
      if (!isFoodOk) {
        calculatedScore = Math.max(5, Math.min(25, 15 + foodScore * 3));
        headline = '💀 OZUQA TANQISLIGI: OCHLIKDAN HALOK BO\'LDINGIZ...';
        detailedStory = 'Boshpanada oziq-ovqat va suv ta\'minotini boshqaruvchi mutaxassis bo\'lmagani sababli, 4-oyda zaxira tugab, hamma ochlikdan halok bo\'ldi.';
      } else if (!isMedOk) {
        calculatedScore = Math.max(5, Math.min(30, 20 + medScore * 3));
        headline = '💀 TIBBIY INQIROZ: EPIDEMIYA SABABLI HAMMA HALOK BO\'LDI...';
        detailedStory = 'Yetarli shifokor va tibbiy jihozlar bo\'lmagani tufayli, bunkerda yuqumli virus tarqaldi va aholi davolanmasdan vafot etdi.';
      } else if (!isTechOk) {
        calculatedScore = Math.max(5, Math.min(30, 15 + techScore * 3));
        headline = '💀 ENERGETIKA HALOKATI: BARCHA TIZIMLAR ISHDAN CHIQDI...';
        detailedStory = 'Muhandislik va elektr generatorlarini tuzatuvchi mutaxassis yo\'qligi sababli ventilyatsiya to\'xtab, bunker aholisi sovuq va havoning zaharlanishidan halok bo\'ldi.';
      } else if (!isReproductionOk) {
        calculatedScore = 40;
        headline = '⚠️ JINSLAR NOMUTANOSIBLIGI: NASL DAVOM ETMADI...';
        detailedStory = `Boshpanada omon qolganlarning barchasi bir xil jins vakillari (${maleCount > 0 ? 'faqat Erkaklar' : 'faqat Ayollar'}) bo'lgani va embrionlar banki topilmagani sababli, insoniyat sivilizatsiyasi keyingi avlodga o'tmay tugadi.`;
      } else {
        calculatedScore = Math.max(10, Math.min(35, 20 + psychScore * 3));
        headline = '💀 RUHIY INQIROZ: BOSHPANA ICHIDA ICHKI NIZO CHIQDI...';
        detailedStory = 'Uzoq yillik yopiq muhitda ruhiy barqarorlik buzilib, omon qoluvchilar o\'rtasidagi kelishmovchiliklar oqibatida bunker barbod bo\'ldi.';
      }
    }

    const result: SimulationResult = {
      isSuccess,
      survivalScore: calculatedScore,
      mode: 'HARDCORE_SIMULATION',
      reproductionStatus,
      headline,
      detailedStory,
      breakdown: {
        foodStatus: isFoodOk ? (foodScore > 2 ? 'abundance' : 'enough') : 'starvation',
        healthStatus: isMedOk ? (medScore > 2 ? 'healthy' : 'illness_treated') : 'epidemic',
        technicalStatus: isTechOk ? (techScore > 2 ? 'flourishing' : 'repaired') : 'failing',
        psychologicalStatus: isPsychOk ? 'peaceful' : 'civil_war',
        defenseStatus: isDefenseOk ? 'secured' : 'breached'
      },
      survivors: survivors.map(s => ({
        id: s.id,
        displayName: s.displayName,
        profession: s.cards.profession?.card?.title || 'Kasbi noma\'lum',
        status: isSuccess ? 'Tirik qoldi (Omon)' : 'Inqirozda halok bo\'ldi'
      }))
    };

    this.state.simulationResult = result;
    this.state.phase = 'FINAL_SIMULATION';
    this.broadcast();
  }

  public addChatMessage(msg: GameRoomState['chatMessages'][0]) {
    this.state.chatMessages.push(msg);
    this.broadcast();
  }

  private startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.state.isTimerPaused && this.state.phaseTimeRemainingSec > 0) {
        this.state.phaseTimeRemainingSec -= 1;
        this.broadcast();
      } else if (this.state.phaseTimeRemainingSec <= 0) {
        if (this.state.phase === 'ROUND_PITCH') {
          this.nextSpeaker();
        } else if (this.state.phase === 'ROUND_DEBATE') {
          this.startVotingPhase();
        }
      }
    }, 1000);
  }

  public toggleTimerPause() {
    this.state.isTimerPaused = !this.state.isTimerPaused;
    this.broadcast();
  }

  public addTimerSeconds(seconds: number) {
    this.state.phaseTimeRemainingSec += seconds;
    this.broadcast();
  }

  public skipCurrent() {
    if (this.state.phase === 'DISASTER_INTRO') {
      this.startRoundsFromIntro();
    } else if (this.state.phase === 'ROUND_PITCH') {
      this.nextSpeaker(); // Advance single speaker!
    } else if (this.state.phase === 'ROUND_DEBATE') {
      this.startVotingPhase();
    } else if (this.state.phase === 'VOTING') {
      this.resolveVoting();
    } else if (this.state.phase === 'BUNKER_EVENT') {
      this.acknowledgeEvent();
    }
    this.broadcast();
  }
}
