export type DeckTheme = 'classic' | 'uzbek' | 'nsfw18';

export type CardCategory =
  | 'profession'
  | 'biology'
  | 'health'
  | 'hobby'
  | 'baggage'
  | 'fact'
  | 'special';

export interface CardItem {
  id: string;
  category: CardCategory;
  title: string;
  description?: string;
  theme: DeckTheme;
  icon?: string;
  impactScore?: {
    food?: number;      // -5 to +5
    medical?: number;   // -5 to +5
    tech?: number;      // -5 to +5
    defense?: number;   // -5 to +5
    psychology?: number;// -5 to +5
  };
  specialAction?: {
    type: 'cancel_vote' | 'swap_profession' | 'add_shelter_slot' | 'steal_baggage' | 'force_reveal' | 'extra_vote';
    params?: Record<string, any>;
  };
}

export interface Catastrophe {
  id: string;
  title: string;
  shortDesc: string;
  fullStory: string;
  theme: DeckTheme;
  requiredSkills: ('food' | 'medical' | 'tech' | 'defense' | 'psychology')[];
  shelterMonths: number; // Duration required to stay inside (e.g. 12 to 120 months)
  hazards: string[];
}

export interface ShelterSpecs {
  areaSqMeters: number;
  durationMonths: number;
  foodSuppliesMonths: number;
  waterSuppliesMonths: number;
  medicalSupplies: string;
  defenseStatus: string;
  specialFeature: string;
  internalThreat?: string;
}

export interface PlayerCardSlot {
  category: CardCategory;
  card: CardItem;
  isRevealed: boolean;
  revealedAtRound?: number;
}

export interface Player {
  id: string;               // Socket ID or unique player ID
  telegramId?: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isHost: boolean;
  isReady: boolean;
  isAlive: boolean;
  cards: Record<CardCategory, PlayerCardSlot>;
  hasUsedSpecialCard: boolean;
  hasVoted: boolean;
  votedForPlayerId?: string | null;
  receivedVotesCount: number;
}

export type VotingMode = 'open' | 'secret';

export interface RoomSettings {
  maxPlayers: number;
  targetSurvivors: number; // e.g. 2, 3, 4
  votingMode: VotingMode;  // 'open' | 'secret'
  finalSimulation: boolean;// true = run algorithm simulation at end
  turnDurationSec: number; // 30, 45, 60
  debateDurationSec: number; // 45, 60, 90
  selectedDecks: DeckTheme[];
  allowSpecialCards: boolean;
}

export type GamePhase =
  | 'LOBBY'
  | 'DISASTER_INTRO'
  | 'ROUND_PITCH'      // Players reveal their card (Round 1: Profession mandatory, Round 2+: Player choice)
  | 'ROUND_DEBATE'     // Free debate timer
  | 'VOTING'           // Voting in progress
  | 'VOTE_RESULTS'     // Show elimination
  | 'FINAL_SIMULATION' // Calculating if shelter survived
  | 'GAME_OVER';

export interface SimulationResult {
  isSuccess: boolean;
  survivalScore: number; // 0 - 100%
  headline: string;
  detailedStory: string;
  breakdown: {
    foodStatus: 'abundance' | 'enough' | 'critical' | 'starvation';
    healthStatus: 'healthy' | 'illness_treated' | 'epidemic' | 'fatal';
    technicalStatus: 'flourishing' | 'repaired' | 'failing' | 'blackout';
    psychologicalStatus: 'peaceful' | 'tense' | 'insanity' | 'civil_war';
    defenseStatus: 'secured' | 'breached' | 'overwhelmed';
  };
  survivors: {
    id: string;
    displayName: string;
    profession: string;
    status: string;
  }[];
}

export interface GameRoomState {
  roomCode: string;
  hostId: string;
  phase: GamePhase;
  roundNumber: number;
  currentSpeakerIndex: number;
  activeSpeakerPlayerId: string | null;
  phaseTimeRemainingSec: number;
  isTimerPaused: boolean;
  catastrophe: Catastrophe | null;
  shelterSpecs: ShelterSpecs | null;
  players: Record<string, Player>;
  playerOrder: string[]; // List of player IDs in speaking order
  settings: RoomSettings;
  eliminatedPlayerIds: string[];
  survivorPlayerIds: string[];
  simulationResult: SimulationResult | null;
  chatMessages: {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    isSystem?: boolean;
  }[];
}

export interface ServerToClientEvents {
  roomStateUpdated: (state: GameRoomState) => void;
  timerTicked: (secondsRemaining: number) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  cardRevealed: (data: { playerId: string; category: CardCategory; card: CardItem }) => void;
  voteCast: (data: { voterId: string; targetId: string | null }) => void;
  playerEliminated: (data: { playerId: string; reason: string }) => void;
  specialCardTriggered: (data: { playerId: string; cardTitle: string; effectDesc: string }) => void;
  chatMessageReceived: (message: GameRoomState['chatMessages'][0]) => void;
  errorOccurred: (message: string) => void;
}

export interface ClientToServerEvents {
  createRoom: (payload: { playerName: string; telegramId?: number; avatarUrl?: string; settings?: Partial<RoomSettings> }, callback: (res: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  joinRoom: (payload: { roomCode: string; playerName: string; telegramId?: number; avatarUrl?: string }, callback: (res: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  setReady: (isReady: boolean) => void;
  startGame: () => void;
  revealCard: (category: CardCategory) => void;
  endPitchTurn: () => void;
  castVote: (targetPlayerId: string) => void;
  triggerSpecialCard: (targetPlayerId?: string) => void;
  sendChatMessage: (text: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  addTimerTime: (seconds: number) => void;
  skipPhase: () => void;
}
