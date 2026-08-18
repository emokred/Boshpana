import { Server, Socket } from 'socket.io';
import { 
  GameRoomState, Player, RoomSettings, CardCategory, 
  SimulationResult, Catastrophe, ShelterSpecs, PlayerCardSlot,
  ClientToServerEvents, ServerToClientEvents, DeckTheme, BunkerEvent
} from '@boshpana/shared';
import { CATASTROPHES, SHELTER_SPECS_PRESETS, CARDS_DATA, BUNKER_EVENTS } from '@boshpana/shared';

export class RoomManager {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private rooms: Map<string, GameRoomState> = new Map();
  private playerSockets: Map<string, string> = new Map(); // socketId -> roomCode
  private roomTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.io = io;
  }

  public createRoom(
    socket: Socket,
    payload: { playerName: string; telegramId?: number; avatarUrl?: string; settings?: Partial<RoomSettings> },
    callback: (res: { success: boolean; roomCode?: string; error?: string }) => void
  ) {
    const roomCode = 'BOSH-' + Math.floor(100 + Math.random() * 900);
    const hostId = socket.id;

    const defaultSettings: RoomSettings = {
      maxPlayers: 10,
      targetSurvivors: 2,
      votingMode: 'open',
      finalSimulation: true,
      turnDurationSec: 45,
      debateDurationSec: 60,
      selectedDecks: ['classic', 'uzbek'],
      allowSpecialCards: true,
      excludedCardIds: [],
      ...payload.settings
    };

    const hostPlayer: Player = {
      id: hostId,
      telegramId: payload.telegramId,
      username: payload.playerName.toLowerCase().replace(/\s+/g, '_'),
      displayName: payload.playerName,
      avatarUrl: payload.avatarUrl,
      isHost: true,
      isReady: true,
      isAlive: true,
      cards: {} as any,
      hasUsedSpecialCard: false,
      hasVoted: false,
      receivedVotesCount: 0
    };

    const roomState: GameRoomState = {
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
      currentBunkerEvent: null,
      players: { [hostId]: hostPlayer },
      playerOrder: [hostId],
      settings: defaultSettings,
      eliminatedPlayerIds: [],
      survivorPlayerIds: [],
      simulationResult: null,
      chatMessages: []
    };

    this.rooms.set(roomCode, roomState);
    this.playerSockets.set(socket.id, roomCode);
    socket.join(roomCode);

    callback({ success: true, roomCode });
    this.broadcastRoomState(roomCode);
  }

  public joinRoom(
    socket: Socket,
    payload: { roomCode: string; playerName: string; telegramId?: number; avatarUrl?: string },
    callback: (res: { success: boolean; roomCode?: string; error?: string }) => void
  ) {
    const room = this.rooms.get(payload.roomCode.toUpperCase());
    if (!room) {
      return callback({ success: false, error: "Xona topilmadi!" });
    }

    if (room.phase !== 'LOBBY') {
      return callback({ success: false, error: "O'yin allaqachon boshlangan!" });
    }

    if (Object.keys(room.players).length >= room.settings.maxPlayers) {
      return callback({ success: false, error: "Xonada joy qolmagan!" });
    }

    const playerId = socket.id;
    const player: Player = {
      id: playerId,
      telegramId: payload.telegramId,
      username: payload.playerName.toLowerCase().replace(/\s+/g, '_'),
      displayName: payload.playerName,
      avatarUrl: payload.avatarUrl,
      isHost: false,
      isReady: false,
      isAlive: true,
      cards: {} as any,
      hasUsedSpecialCard: false,
      hasVoted: false,
      receivedVotesCount: 0
    };

    room.players[playerId] = player;
    room.playerOrder.push(playerId);

    this.playerSockets.set(socket.id, room.roomCode);
    socket.join(room.roomCode);

    callback({ success: true, roomCode: room.roomCode });
    this.broadcastRoomState(room.roomCode);
  }

  public updateSettings(socket: Socket, settings: Partial<RoomSettings>) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.hostId !== socket.id || room.phase !== 'LOBBY') return;

    room.settings = { ...room.settings, ...settings };
    this.broadcastRoomState(room.roomCode);
  }

  public setReady(socket: Socket, isReady: boolean) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.phase !== 'LOBBY') return;

    const player = room.players[socket.id];
    if (player) {
      player.isReady = isReady;
      this.broadcastRoomState(room.roomCode);
    }
  }

  public startGame(socket: Socket) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.hostId !== socket.id || room.phase !== 'LOBBY') return;

    if (Object.keys(room.players).length < 2) return;

    // 1. Pick Catastrophe & Shelter
    const matchingCatastrophes = CATASTROPHES.filter((c) =>
      room.settings.selectedDecks.includes(c.theme)
    );
    room.catastrophe = matchingCatastrophes[Math.floor(Math.random() * matchingCatastrophes.length)] || CATASTROPHES[0];
    room.shelterSpecs = SHELTER_SPECS_PRESETS[Math.floor(Math.random() * SHELTER_SPECS_PRESETS.length)];

    // 2. Deal Cards
    const matchingCards = CARDS_DATA.filter((c) =>
      room.settings.selectedDecks.includes(c.theme) &&
      !room.settings.excludedCardIds?.includes(c.id)
    );
    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

    Object.values(room.players).forEach((player) => {
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

    room.phase = 'DISASTER_INTRO';
    room.roundNumber = 1;
    room.currentSpeakerIndex = 0;
    room.activeSpeakerPlayerId = room.playerOrder[0];
    room.phaseTimeRemainingSec = room.settings.turnDurationSec;
    this.broadcastRoomState(room.roomCode);
  }

  public revealCard(socket: Socket, category: CardCategory) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.phase !== 'ROUND_PITCH') return;

    const player = room.players[socket.id];
    if (player && player.cards[category]) {
      // In Round 1, only profession allowed; in Round 2+, any unrevealed allowed
      if (room.roundNumber === 1 && category !== 'profession') return;

      player.cards[category].isRevealed = true;
      player.cards[category].revealedAtRound = room.roundNumber;

      this.addChatMessage(room, {
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'Tizim',
        text: `📢 ${player.displayName} o'z kartasini ochdi: [${category.toUpperCase()}] ${player.cards[category].card.title}`,
        timestamp: Date.now(),
        isSystem: true
      });

      this.broadcastRoomState(room.roomCode);
    }
  }

  public endPitchTurn(socket: Socket) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.phase !== 'ROUND_PITCH') return;
    if (room.activeSpeakerPlayerId !== socket.id && room.hostId !== socket.id) return;

    this.nextSpeaker(room);
  }

  private nextSpeaker(room: GameRoomState) {
    const aliveOrder = room.playerOrder.filter((id) => room.players[id]?.isAlive);
    const nextIndex = room.currentSpeakerIndex + 1;

    if (nextIndex < aliveOrder.length) {
      room.currentSpeakerIndex = nextIndex;
      room.activeSpeakerPlayerId = aliveOrder[nextIndex];
      room.phaseTimeRemainingSec = room.settings.turnDurationSec;
    } else {
      // Move to Debate Phase
      room.phase = 'ROUND_DEBATE';
      room.activeSpeakerPlayerId = null;
      room.phaseTimeRemainingSec = room.settings.debateDurationSec;
    }
    this.broadcastRoomState(room.roomCode);
  }

  public castVote(socket: Socket, targetPlayerId: string) {
    const room = this.getRoomBySocket(socket);
    if (!room || room.phase !== 'VOTING') return;

    const voter = room.players[socket.id];
    const target = room.players[targetPlayerId];

    if (voter && target && !voter.hasVoted && voter.isAlive && target.isAlive) {
      voter.hasVoted = true;
      voter.votedForPlayerId = targetPlayerId;
      target.receivedVotesCount = (target.receivedVotesCount || 0) + 1;

      const alivePlayers = Object.values(room.players).filter((p) => p.isAlive);
      const allVoted = alivePlayers.every((p) => p.hasVoted);

      if (allVoted) {
        this.resolveVoting(room);
      } else {
        this.broadcastRoomState(room.roomCode);
      }
    }
  }

  private resolveVoting(room: GameRoomState) {
    const alivePlayers = Object.values(room.players).filter((p) => p.isAlive);
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
      room.eliminatedPlayerIds.push((eliminatedPlayer as Player).id);

      this.addChatMessage(room, {
        id: Math.random().toString(),
        senderId: 'system',
        senderName: 'Tizim',
        text: `💀 Ovoz berish natijasida ${(eliminatedPlayer as Player).displayName} boshpanadan chiqarib yuborildi!`,
        timestamp: Date.now(),
        isSystem: true
      });
    }

    const remainingAlive = Object.values(room.players).filter((p) => p.isAlive);

    if (remainingAlive.length <= room.settings.targetSurvivors) {
      room.survivorPlayerIds = remainingAlive.map((p) => p.id);
      if (room.settings.finalSimulation) {
        this.runEndingSimulation(room);
      } else {
        room.phase = 'GAME_OVER';
        this.broadcastRoomState(room.roomCode);
      }
    } else {
      // Surprise Bunker Event
      const randomEvent = BUNKER_EVENTS[Math.floor(Math.random() * BUNKER_EVENTS.length)];
      room.currentBunkerEvent = randomEvent;
      room.phase = 'BUNKER_EVENT';
      this.broadcastRoomState(room.roomCode);
    }
  }

  private runEndingSimulation(room: GameRoomState) {
    const survivors = Object.values(room.players).filter((p) => p.isAlive);
    let foodScore = 0, medicalScore = 0, techScore = 0, defenseScore = 0, psychScore = 0;

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
        ? `Boshpanada yashagan ${room.catastrophe?.shelterMonths || 24} oy davomida jamoa barcha sinovlardan omon chiqdi va yangi dunyoga qadam qo'ydi!`
        : `Afsuski, yetarli bilim va resurslar bo'lmagani sababli boshpana aholisi izolyatsiyadan chiqa olmadi.`,
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
        status: isSuccess ? 'Omon qoldi' : 'Halok bo\'ldi'
      }))
    };

    room.simulationResult = result;
    room.phase = 'FINAL_SIMULATION';
    this.broadcastRoomState(room.roomCode);
  }

  public handleDisconnect(socket: Socket) {
    const roomCode = this.playerSockets.get(socket.id);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (room) {
      delete room.players[socket.id];
      room.playerOrder = room.playerOrder.filter((id) => id !== socket.id);

      if (room.hostId === socket.id && room.playerOrder.length > 0) {
        room.hostId = room.playerOrder[0];
        if (room.players[room.hostId]) {
          room.players[room.hostId].isHost = true;
        }
      }

      if (room.playerOrder.length === 0) {
        this.rooms.delete(roomCode);
        const timer = this.roomTimers.get(roomCode);
        if (timer) clearInterval(timer);
      } else {
        this.broadcastRoomState(roomCode);
      }
    }

    this.playerSockets.delete(socket.id);
  }

  private addChatMessage(room: GameRoomState, msg: GameRoomState['chatMessages'][0]) {
    room.chatMessages.push(msg);
  }

  private getRoomBySocket(socket: Socket): GameRoomState | undefined {
    const roomCode = this.playerSockets.get(socket.id);
    return roomCode ? this.rooms.get(roomCode) : undefined;
  }

  private broadcastRoomState(roomCode: string) {
    const room = this.rooms.get(roomCode);
    if (room) {
      this.io.to(roomCode).emit('roomStateUpdated', room);
    }
  }
}
