import { 
  GameRoomState, Player, RoomSettings, CardCategory, 
  SimulationResult, Catastrophe, ShelterSpecs, PlayerCardSlot 
} from '@boshpana/shared';
import { CATASTROPHES, SHELTER_SPECS_PRESETS, CARDS_DATA } from '@boshpana/shared';

// Helper to shuffle array
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
      ...initialSettings
    };

    this.state = {
      roomCode,
      hostId,
      phase: 'LOBBY',
      roundNumber: 1,
      currentSpeakerIndex: 0,
      activeSpeakerPlayerId: null,
      phaseTimeRemainingSec: defaultSettings.turnDurationSec,
      isTimerPaused: false,
      catastrophe: null,
      shelterSpecs: null,
      players: {
        [hostId]: {
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
        }
      },
      playerOrder: [hostId],
      settings: defaultSettings,
      eliminatedPlayerIds: [],
      survivorPlayerIds: [],
      simulationResult: null,
      chatMessages: []
    };

    // Add demo bots for instant testing if in standalone mode
    this.addDemoBots();
    this.broadcast();
  }

  public getState() {
    return this.state;
  }

  private broadcast() {
    this.onStateChange({ ...this.state, players: { ...this.state.players } });
  }

  public addDemoBots() {
    const botNames = ['Jasur (Bot)', 'Malika (Bot)', 'Bekzod (Bot)', 'Dilnoza (Bot)'];
    botNames.forEach((name) => {
      const id = 'bot-' + Math.random().toString(36).substring(2, 7);
      this.state.players[id] = {
        id,
        username: name.toLowerCase().replace(/[^a-z]/g, ''),
        displayName: name,
        isHost: false,
        isReady: true,
        isAlive: true,
        cards: {} as any,
        hasUsedSpecialCard: false,
        hasVoted: false,
        receivedVotesCount: 0
      };
      this.state.playerOrder.push(id);
    });
  }

  public updateSettings(settings: Partial<RoomSettings>) {
    this.state.settings = { ...this.state.settings, ...settings };
    this.broadcast();
  }

  public setReady(playerId: string, isReady: boolean) {
    if (this.state.players[playerId]) {
      this.state.players[playerId].isReady = isReady;
      this.broadcast();
    }
  }

  public startGame() {
    // 1. Pick Catastrophe & Shelter
    const matchingCatastrophes = CATASTROPHES.filter((c) =>
      this.state.settings.selectedDecks.includes(c.theme)
    );
    this.state.catastrophe = matchingCatastrophes[Math.floor(Math.random() * matchingCatastrophes.length)] || CATASTROPHES[0];
    this.state.shelterSpecs = SHELTER_SPECS_PRESETS[Math.floor(Math.random() * SHELTER_SPECS_PRESETS.length)];

    // 2. Deal Cards to all players
    const matchingCards = CARDS_DATA.filter((c) =>
      this.state.settings.selectedDecks.includes(c.theme)
    );

    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

    Object.values(this.state.players).forEach((player) => {
      const playerCards: Record<CardCategory, PlayerCardSlot> = {} as any;

      categories.forEach((cat) => {
        const catCards = matchingCards.filter((c) => c.category === cat);
        const card = catCards.length > 0
          ? catCards[Math.floor(Math.random() * catCards.length)]
          : CARDS_DATA.find((c) => c.category === cat)!;

        playerCards[cat] = {
          category: cat,
          card,
          isRevealed: false
        };
      });

      player.cards = playerCards;
      player.isAlive = true;
      player.hasVoted = false;
      player.receivedVotesCount = 0;
    });

    this.state.phase = 'DISASTER_INTRO';
    this.state.roundNumber = 1;
    this.state.currentSpeakerIndex = 0;
    this.state.activeSpeakerPlayerId = this.state.playerOrder[0];
    this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;
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
    if (player && player.cards[category]) {
      player.cards[category].isRevealed = true;
      player.cards[category].revealedAtRound = this.state.roundNumber;

      // Add system message to chat
      this.addChatMessage({
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'Tizim',
        text: `📢 ${player.displayName} o'z kartasini ochdi: [${category.toUpperCase()}] ${player.cards[category].card.title}`,
        timestamp: Date.now(),
        isSystem: true
      });

      this.broadcast();
    }
  }

  public nextSpeaker() {
    // Find alive players
    const aliveOrder = this.state.playerOrder.filter((id) => this.state.players[id]?.isAlive);
    const nextIndex = this.state.currentSpeakerIndex + 1;

    if (nextIndex < aliveOrder.length) {
      this.state.currentSpeakerIndex = nextIndex;
      this.state.activeSpeakerPlayerId = aliveOrder[nextIndex];
      this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;

      // If bot, reveal card automatically
      if (this.state.activeSpeakerPlayerId.startsWith('bot-')) {
        this.botTurn(this.state.activeSpeakerPlayerId);
      }
    } else {
      // All speakers finished pitch -> Move to Debate or Voting
      this.startDebatePhase();
    }
    this.broadcast();
  }

  private botTurn(botId: string) {
    const bot = this.state.players[botId];
    if (!bot) return;

    if (this.state.roundNumber === 1) {
      this.revealCard(botId, 'profession');
    } else {
      const unrevealed = (Object.keys(bot.cards) as CardCategory[]).filter((k) => !bot.cards[k].isRevealed);
      if (unrevealed.length > 0) {
        this.revealCard(botId, unrevealed[Math.floor(Math.random() * unrevealed.length)]);
      }
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

    // Reset votes
    Object.values(this.state.players).forEach((p) => {
      p.hasVoted = false;
      p.votedForPlayerId = null;
      p.receivedVotesCount = 0;
    });

    // Make bots vote automatically
    setTimeout(() => {
      const alivePlayers = Object.values(this.state.players).filter((p) => p.isAlive);
      alivePlayers.forEach((p) => {
        if (p.id.startsWith('bot-')) {
          const targets = alivePlayers.filter((t) => t.id !== p.id);
          if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            this.castVote(p.id, target.id);
          }
        }
      });
    }, 1500);

    this.broadcast();
  }

  public castVote(voterId: string, targetId: string) {
    const voter = this.state.players[voterId];
    const target = this.state.players[targetId];

    if (voter && target && !voter.hasVoted) {
      voter.hasVoted = true;
      voter.votedForPlayerId = targetId;
      target.receivedVotesCount = (target.receivedVotesCount || 0) + 1;

      // Check if all alive players voted
      const alivePlayers = Object.values(this.state.players).filter((p) => p.isAlive);
      const allVoted = alivePlayers.every((p) => p.hasVoted);

      if (allVoted) {
        this.resolveVoting();
      } else {
        this.broadcast();
      }
    }
  }

  private resolveVoting() {
    const alivePlayers = Object.values(this.state.players).filter((p) => p.isAlive);
    
    // Find player with highest votes
    let maxVotes = -1;
    let eliminatedPlayer: Player | null = null;

    alivePlayers.forEach((p) => {
      if (p.receivedVotesCount > maxVotes) {
        maxVotes = p.receivedVotesCount;
        eliminatedPlayer = p;
      }
    });

    if (eliminatedPlayer) {
      (eliminatedPlayer as Player).isAlive = false;
      this.state.eliminatedPlayerIds.push((eliminatedPlayer as Player).id);

      this.addChatMessage({
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'Tizim',
        text: `💀 Ovoz berish natijasida ${(eliminatedPlayer as Player).displayName} boshpanadan chiqarib yuborildi!`,
        timestamp: Date.now(),
        isSystem: true
      });
    }

    // Check if target survivor count reached
    const remainingAlive = Object.values(this.state.players).filter((p) => p.isAlive);

    if (remainingAlive.length <= this.state.settings.targetSurvivors) {
      this.state.survivorPlayerIds = remainingAlive.map((p) => p.id);
      
      if (this.state.settings.finalSimulation) {
        this.runEndingSimulation();
      } else {
        this.state.phase = 'GAME_OVER';
        this.broadcast();
      }
    } else {
      // Start Next Round!
      this.state.roundNumber += 1;
      this.state.phase = 'ROUND_PITCH';
      this.state.currentSpeakerIndex = 0;
      const nextAlive = this.state.playerOrder.filter((id) => this.state.players[id]?.isAlive);
      this.state.activeSpeakerPlayerId = nextAlive[0];
      this.state.phaseTimeRemainingSec = this.state.settings.turnDurationSec;
      this.broadcast();
    }
  }

  private runEndingSimulation() {
    const survivors = Object.values(this.state.players).filter((p) => p.isAlive);
    
    // Calculate total impact scores
    let foodScore = 0;
    let medicalScore = 0;
    let techScore = 0;
    let defenseScore = 0;
    let psychScore = 0;

    survivors.forEach((s) => {
      Object.values(s.cards).forEach((c) => {
        if (c.card.impactScore) {
          foodScore += c.card.impactScore.food || 0;
          medicalScore += c.card.impactScore.medical || 0;
          techScore += c.card.impactScore.tech || 0;
          defenseScore += c.card.impactScore.defense || 0;
          psychScore += c.card.impactScore.psychology || 0;
        }
      });
    });

    const isFoodOk = foodScore >= 0;
    const isMedOk = medicalScore >= 0;
    const isTechOk = techScore >= 0;
    const isPsychOk = psychScore >= 0;

    const totalPassed = [isFoodOk, isMedOk, isTechOk, isPsychOk].filter(Boolean).length;
    const isSuccess = totalPassed >= 3;
    const survivalScore = Math.min(100, Math.max(10, Math.round((totalPassed / 4) * 85 + Math.random() * 15)));

    const result: SimulationResult = {
      isSuccess,
      survivalScore,
      headline: isSuccess 
        ? "G'ALABA! Boshpana ahli omon qoldi va yangi sivilizatsiyaga asos soldi!" 
        : "HALOKAT! Boshpana resurslar yetishmovchiligidan quladi...",
      detailedStory: isSuccess
        ? `Boshpanada yashagan ${this.state.catastrophe?.shelterMonths || 24} oy davomida jamoa oziq-ovqat va generatorlarni to'g'ri boshqardi. Garchi ba'zi qiyinchiliklar bo'lsa-da, ${survivors.map(s => s.displayName).join(', ')} yer yuziga sog'-salomat qaytib chiqdi!`
        : `Afsuski, bunker ichida oziq-ovqat va tibbiy ta'minot noto'g'ri taqsimlandi. Ichki nizolar va tizimlarning ishdan chiqishi tufayli bunker aholisi qiyin ahvolda qoldi.`,
      breakdown: {
        foodStatus: isFoodOk ? 'enough' : 'starvation',
        healthStatus: isMedOk ? 'healthy' : 'fatal',
        technicalStatus: isTechOk ? 'flourishing' : 'failing',
        psychologicalStatus: isPsychOk ? 'peaceful' : 'civil_war',
        defenseStatus: defenseScore >= 0 ? 'secured' : 'breached'
      },
      survivors: survivors.map((s) => ({
        id: s.id,
        displayName: s.displayName,
        profession: s.cards.profession?.card?.title || 'Kasbi noma\'lum',
        status: isSuccess ? 'Tirik qoldi (Omon)' : 'Qiyinchilikda halok bo\'ldi'
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
}
