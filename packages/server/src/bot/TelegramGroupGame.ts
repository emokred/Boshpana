import { Bot, Context, InlineKeyboard } from 'grammy';
import { 
  CARDS_DATA, CATASTROPHES, SHELTER_SPECS_PRESETS, BUNKER_EVENTS,
  CardCategory, CardItem, PlayerCardSlot, Catastrophe, ShelterSpecs, BunkerEvent
} from '@boshpana/shared';

export interface GroupPlayer {
  id: number; // Telegram user id
  name: string;
  username?: string;
  cards: Record<CardCategory, PlayerCardSlot>;
  isAlive: boolean;
  hasVoted: boolean;
  receivedVotesCount: number;
}

export interface GroupGameState {
  chatId: number;
  chatTitle: string;
  hostId: number;
  hostName: string;
  phase: 'LOBBY' | 'ROUND_PITCH' | 'DEBATE' | 'VOTING' | 'BUNKER_EVENT' | 'GAME_OVER';
  players: Map<number, GroupPlayer>;
  playerOrder: number[];
  roundNumber: number;
  catastrophe: Catastrophe;
  shelterSpecs: ShelterSpecs;
  targetSurvivors: number;
  votingPollMessageId?: number;
  activeTimer?: NodeJS.Timeout;
}

export class TelegramGroupGameManager {
  private bot: Bot;
  private games: Map<number, GroupGameState> = new Map(); // chatId -> Game

  constructor(bot: Bot) {
    this.bot = bot;
  }

  // ================= 1. START LOBBY IN GROUP =================
  public async handleStartLobby(ctx: Context) {
    if (!ctx.chat || (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup')) {
      await ctx.reply("⚠️ Ushbu buyruq faqat Telegram guruhlarda ishlaydi! Guruhga botni qo'shib /boshpana buyrug'ini yuboring.");
      return;
    }

    const chatId = ctx.chat.id;
    const existing = this.games.get(chatId);
    if (existing && existing.phase !== 'GAME_OVER') {
      await ctx.reply("⚠️ Guruhda allaqachon faol o'yin mavjud! /stopgame buyrug'i bilan uni to'xtatishingiz mumkin.");
      return;
    }

    const hostId = ctx.from!.id;
    const hostName = ctx.from!.first_name || 'Boshlovchi';

    const cat = CATASTROPHES[Math.floor(Math.random() * CATASTROPHES.length)];
    const sh = SHELTER_SPECS_PRESETS[Math.floor(Math.random() * SHELTER_SPECS_PRESETS.length)];

    const newGame: GroupGameState = {
      chatId,
      chatTitle: ctx.chat.title || 'Guruh',
      hostId,
      hostName,
      phase: 'LOBBY',
      players: new Map(),
      playerOrder: [],
      roundNumber: 1,
      catastrophe: cat,
      shelterSpecs: sh,
      targetSurvivors: 2
    };

    // Auto-add host
    newGame.players.set(hostId, {
      id: hostId,
      name: hostName,
      username: ctx.from?.username,
      cards: {} as any,
      isAlive: true,
      hasVoted: false,
      receivedVotesCount: 0
    });
    newGame.playerOrder.push(hostId);

    this.games.set(chatId, newGame);
    await this.renderLobbyMessage(ctx, newGame);
  }

  private async renderLobbyMessage(ctx: Context, game: GroupGameState, messageIdToEdit?: number) {
    const keyboard = new InlineKeyboard()
      .text('➕ O\'yinga Qo\'shilish (Join)', 'group_join')
      .text('➖ Chiqish', 'group_leave')
      .row()
      .text('🚀 O\'yinni Boshlash (Start)', 'group_start')
      .text('⚙️ Qoidalar', 'group_rules');

    const playerList = Array.from(game.players.values())
      .map((p, idx) => `${idx + 1}. 👤 ${p.name} ${p.username ? `(@${p.username})` : ''} ${p.id === game.hostId ? '👑 [Host]' : ''}`)
      .join('\n');

    const text = 
      `🚨 <b>BOSHPANA | Guruh O'yini Xonasi Ochildi!</b>\n\n` +
      `🏛 <b>Guruh:</b> ${game.chatTitle}\n` +
      `👑 <b>Host:</b> ${game.hostName}\n\n` +
      `👥 <b>Qo'shilgan o'yinchilar (${game.players.size}/16):</b>\n${playerList}\n\n` +
      `<i>O'yinga qo'shilish uchun pastdagi "➕ Qo'shilish" tugmasini bosing. Kamida 3 kishi kerak!</i>`;

    if (messageIdToEdit) {
      try {
        await ctx.api.editMessageText(game.chatId, messageIdToEdit, text, {
          parse_mode: 'HTML',
          reply_markup: keyboard
        });
      } catch {}
    } else {
      await ctx.reply(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
  }

  // ================= 2. HANDLE INLINE ACTIONS (JOIN / LEAVE / START) =================
  public async handleCallbackQuery(ctx: Context) {
    const data = ctx.callbackQuery?.data;
    if (!data || !ctx.chat) return;

    const game = this.games.get(ctx.chat.id);
    if (!game) {
      await ctx.answerCallbackQuery({ text: "Bu o'yin allaqachon yakunlangan." });
      return;
    }

    const userId = ctx.from!.id;
    const userName = ctx.from!.first_name || 'O\'yinchi';

    // JOIN
    if (data === 'group_join') {
      if (game.phase !== 'LOBBY') {
        return ctx.answerCallbackQuery({ text: "O'yin allaqachon boshlangan!", show_alert: true });
      }
      if (game.players.has(userId)) {
        return ctx.answerCallbackQuery({ text: "Siz allaqachon ro'yxatdasiz!" });
      }
      if (game.players.size >= 16) {
        return ctx.answerCallbackQuery({ text: "Xonada joy qolmagan (maks 16 kishi)!", show_alert: true });
      }

      game.players.set(userId, {
        id: userId,
        name: userName,
        username: ctx.from?.username,
        cards: {} as any,
        isAlive: true,
        hasVoted: false,
        receivedVotesCount: 0
      });
      game.playerOrder.push(userId);

      await ctx.answerCallbackQuery({ text: "Siz o'yinga muvaffaqiyatli qo'shildingiz! 🎉" });
      await this.renderLobbyMessage(ctx, game, ctx.callbackQuery?.message?.message_id);
      return;
    }

    // LEAVE
    if (data === 'group_leave') {
      if (game.phase !== 'LOBBY') return;
      if (!game.players.has(userId)) {
        return ctx.answerCallbackQuery({ text: "Siz o'yinda emassiz." });
      }
      if (userId === game.hostId && game.players.size > 1) {
        // Transfer host
        game.players.delete(userId);
        game.playerOrder = game.playerOrder.filter(id => id !== userId);
        game.hostId = game.playerOrder[0];
        game.hostName = game.players.get(game.hostId)?.name || 'Host';
      } else {
        game.players.delete(userId);
        game.playerOrder = game.playerOrder.filter(id => id !== userId);
      }

      if (game.players.size === 0) {
        this.games.delete(ctx.chat.id);
        await ctx.answerCallbackQuery({ text: "Xona bekor qilindi." });
        return;
      }

      await ctx.answerCallbackQuery({ text: "Siz xonadan chiqdingiz." });
      await this.renderLobbyMessage(ctx, game, ctx.callbackQuery?.message?.message_id);
      return;
    }

    // RULES
    if (data === 'group_rules') {
      await ctx.answerCallbackQuery();
      await ctx.reply(
        `📜 <b>BOSHPANA GURUH QOIDALARI:</b>\n\n` +
        `1. Bot sizga shaxsiy xabarda 7 ta maxfiy kartangizni yuboradi.\n` +
        `2. 1-raundda hamma o'z Kasbini guruhga e'lon qiladi.\n` +
        `3. Guruh Ovozli Chatida (Voice Chat) yoki guruh matnida kim kerakligini tortishasiz.\n` +
        `4. Raund oxirida guruh so'rovnomasi (Poll) orqali 1 kishi chiqarib yuboriladi!\n` +
        `5. Qolgan 2 ta omon qoluvchi bilan g'alaba hisoblanadi!`,
        { parse_mode: 'HTML' }
      );
      return;
    }

    // START GAME
    if (data === 'group_start') {
      if (userId !== game.hostId) {
        return ctx.answerCallbackQuery({ text: "Faqat Host o'yinni boshlashi mumkin!", show_alert: true });
      }
      if (game.players.size < 3) {
        return ctx.answerCallbackQuery({ text: "O'yinni boshlash uchun kamida 3 nafar o'yinchi kerak!", show_alert: true });
      }

      await ctx.answerCallbackQuery({ text: "O'yin boshlanmoqda..." });
      await this.startGame(ctx, game);
    }
  }

  // ================= 3. START GAME & DEAL CARDS =================
  private async startGame(ctx: Context, game: GroupGameState) {
    game.phase = 'ROUND_PITCH';
    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

    // Deal cards to each player
    for (const player of game.players.values()) {
      const cards: Record<CardCategory, PlayerCardSlot> = {} as any;
      categories.forEach((catKey) => {
        const catCards = CARDS_DATA.filter((c) => c.category === catKey);
        const card = catCards[Math.floor(Math.random() * catCards.length)] || CARDS_DATA[0];
        cards[catKey] = {
          category: catKey,
          card,
          isRevealed: false
        };
      });
      player.cards = cards;

      // Send private DM with cards
      await this.sendPrivateCards(player);
    }

    // Announce Catastrophe in Group
    const catastropheMsg = 
      `🚨 <b>FALOKAT YUZ BERDI: ${game.catastrophe.title.toUpperCase()}!</b>\n\n` +
      `📖 <b>Tafsilot:</b> ${game.catastrophe.shortDesc}\n\n` +
      `🏛 <b>Boshpana:</b> Maydoni ${game.shelterSpecs.areaSqMeters} kv.m, ${game.catastrophe.shelterMonths} oylik resurs.\n` +
      `⚠️ <b>Xavflar:</b> ${game.catastrophe.hazards.join(', ')}\n` +
      `🎯 <b>Boshpanaga faqat ${game.targetSurvivors} nafar eng kerakli mutaxassis kira oladi!</b>\n\n` +
      `📩 <i>Har bir o'yinchiga shaxsiy xabarda (DM) maxfiy kartalari yuborildi!</i>\n\n` +
      `👇 <b>1-RAUND: KASBLAR JANGI!</b>\n` +
      `O'z kasbingizni guruhga ochish uchun pastdagi tugmani bosing:`;

    const keyboard = new InlineKeyboard()
      .text('🩺 Kasbimni Hammaga Ochish', 'group_reveal_prof')
      .row()
      .text('📩 Kartalarimni Qayta Ko\'rish', 'group_my_cards');

    await ctx.api.sendMessage(game.chatId, catastropheMsg, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }

  // Send private cards to player DM
  private async sendPrivateCards(player: GroupPlayer) {
    try {
      const cardList = Object.entries(player.cards).map(([catKey, slot]) => {
        return `• <b>[${catKey.toUpperCase()}]:</b> ${slot.card.title}`;
      }).join('\n');

      const dmText = 
        `🎴 <b>Sizning Maxfiy Boshpana Kartalaringiz:</b>\n\n` +
        `${cardList}\n\n` +
        `<i>Eslatma: Guruhda navbatingiz kelganda o'z xislatlaringizni himoya qiling!</i>`;

      await this.bot.api.sendMessage(player.id, dmText, { parse_mode: 'HTML' });
    } catch (err) {
      console.warn(`Could not send DM to player ${player.id}. User may not have started the bot.`);
    }
  }

  // Reveal profession in group chat
  public async handleRevealProfession(ctx: Context) {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const game = this.games.get(chatId);
    if (!game) return;

    const userId = ctx.from!.id;
    const player = game.players.get(userId);
    if (!player) {
      return ctx.answerCallbackQuery({ text: "Siz bu o'yinda qatnashmayapsiz." });
    }

    if (player.cards.profession.isRevealed) {
      return ctx.answerCallbackQuery({ text: "Siz allaqachon kasbingizni ochgansiz!" });
    }

    player.cards.profession.isRevealed = true;
    await ctx.answerCallbackQuery({ text: "Kasbingiz guruhga e'lon qilindi!" });

    await ctx.reply(
      `📢 <b>${player.name}</b> o'z kasbini ochdi:\n` +
      `👉 <b>[KASB]:</b> <b>${player.cards.profession.card.title}</b>\n` +
      `<i>"${player.cards.profession.card.description || 'Mutaxassis'}"</i>`,
      { parse_mode: 'HTML' }
    );

    // Check if all alive players revealed their profession
    const alivePlayers = Array.from(game.players.values()).filter(p => p.isAlive);
    const allRevealed = alivePlayers.every(p => p.cards.profession.isRevealed);

    if (allRevealed) {
      await this.startDebateAndVoting(ctx, game);
    }
  }

  // Start Debate & Poll Voting in group
  private async startDebateAndVoting(ctx: Context, game: GroupGameState) {
    game.phase = 'DEBATE';

    await ctx.api.sendMessage(
      game.chatId,
      `🗣 <b>BARCHA KASBLAR OCHILDI!</b>\n\n` +
      `Endi guruhda (yoki Guruh Ovozli Chatida) 60 soniya davomida kim eng kam foydali ekanini muhokama qiling!\n\n` +
      `⏱ <i>60 soniyadan so'ng chiqarib yuborish bo'yicha so'rovnoma (Ovoz berish) boshlanadi!</i>`,
      { parse_mode: 'HTML' }
    );

    // Wait 45 seconds then trigger Poll Voting
    setTimeout(async () => {
      await this.launchVotingPoll(game);
    }, 45000);
  }

  // Launch Telegram Native Poll for Voting
  private async launchVotingPoll(game: GroupGameState) {
    game.phase = 'VOTING';
    const alivePlayers = Array.from(game.players.values()).filter(p => p.isAlive);

    const pollOptions = alivePlayers.map(p => `${p.name} (${p.cards.profession.card.title})`);

    try {
      const pollMsg = await this.bot.api.sendPoll(
        game.chatId,
        `💀 ${game.roundNumber}-RAUND: Boshpanadan kim chiqarib yuborilsin?`,
        pollOptions,
        {
          is_anonymous: false,
          open_period: 45 // 45 seconds to vote
        }
      );
      game.votingPollMessageId = pollMsg.message_id;

      // Schedule poll resolution after 45 seconds
      setTimeout(async () => {
        await this.resolveGroupVoting(game);
      }, 46000);
    } catch (err) {
      console.error("Poll launch error:", err);
    }
  }

  // Resolve Voting & Eliminate
  private async resolveGroupVoting(game: GroupGameState) {
    const alivePlayers = Array.from(game.players.values()).filter(p => p.isAlive);
    if (alivePlayers.length <= game.targetSurvivors) {
      await this.finishGroupGame(game);
      return;
    }

    // Pick victim (simulated or top voted)
    const victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    victim.isAlive = false;

    await this.bot.api.sendMessage(
      game.chatId,
      `💀 <b>OVOZ BERISH NATIJASI:</b>\n\n` +
      `<b>${victim.name}</b> (${victim.cards.profession.card.title}) boshpanadan chiqarib yuborildi!\n\n` +
      `🚪 Boshpana eshiklari yopildi. Qolgan o'yinchilar soni: <b>${alivePlayers.length - 1} kishi</b>.`,
      { parse_mode: 'HTML' }
    );

    const remainingAlive = Array.from(game.players.values()).filter(p => p.isAlive);
    if (remainingAlive.length <= game.targetSurvivors) {
      await this.finishGroupGame(game);
    } else {
      // Trigger surprise Bunker Event
      const ev = BUNKER_EVENTS[Math.floor(Math.random() * BUNKER_EVENTS.length)];
      await this.bot.api.sendMessage(
        game.chatId,
        `📦 <b>KUTILMAGAN BUNKER HODISASI!</b>\n\n` +
        `💥 <b>${ev.title}</b>\n` +
        `📝 ${ev.description}\n\n` +
        `<i>${game.roundNumber + 1}-raund tayyorlanmoqda...</i>`,
        { parse_mode: 'HTML' }
      );

      game.roundNumber += 1;
      setTimeout(async () => {
        await this.startNextGroupRound(game);
      }, 10000);
    }
  }

  private async startNextGroupRound(game: GroupGameState) {
    game.phase = 'ROUND_PITCH';
    const categories: CardCategory[] = ['biology', 'health', 'baggage', 'hobby', 'fact', 'special'];
    const currentCat = categories[(game.roundNumber - 2) % categories.length];

    const keyboard = new InlineKeyboard()
      .text(`🔓 [${currentCat.toUpperCase()}] Kartamni Ochish`, `group_reveal_${currentCat}`)
      .row()
      .text('📩 Kartalarimni Ko\'rish', 'group_my_cards');

    await this.bot.api.sendMessage(
      game.chatId,
      `🚨 <b>${game.roundNumber}-RAUND BOSHLANDI!</b>\n\n` +
      `Bu raundda barcha omon qolganlar o'zlarining <b>[${currentCat.toUpperCase()}]</b> kartasini ochishi kerak!\n\n` +
      `👇 Kartangizni ochish uchun pastdagi tugmani bosing:`,
      { parse_mode: 'HTML', reply_markup: keyboard }
    );
  }

  // Finish Game & Announce Final Simulation
  private async finishGroupGame(game: GroupGameState) {
    game.phase = 'GAME_OVER';
    const survivors = Array.from(game.players.values()).filter(p => p.isAlive);

    const survivorList = survivors
      .map(s => `🏆 <b>${s.name}</b> — ${s.cards.profession.card.title}`)
      .join('\n');

    await this.bot.api.sendMessage(
      game.chatId,
      `🎉 <b>G'ALABA! BOSHPANA OMON QOLDI!</b>\n\n` +
      `Boshpanaga kirgan ${survivors.length} nafar qahramon yangi sivilizatsiyani tikladi:\n\n` +
      `${survivorList}\n\n` +
      `👏 Barcha ishtirokchilarga rahmat! Yangi o'yin boshlash uchun /boshpana deb yozing.`,
      { parse_mode: 'HTML' }
    );

    this.games.delete(game.chatId);
  }

  // Cancel Game
  public async handleStopGame(ctx: Context) {
    if (!ctx.chat) return;
    const game = this.games.get(ctx.chat.id);
    if (!game) {
      await ctx.reply("Guruhda faol o'yin mavjud emas.");
      return;
    }

    const userId = ctx.from?.id;
    if (userId !== game.hostId) {
      await ctx.reply("⚠️ Faqat o'yinni boshlagan Host (/stopgame) qila oladi.");
      return;
    }

    this.games.delete(ctx.chat.id);
    await ctx.reply("🛑 O'yin bekor qilindi. Yangi o'yin uchun /boshpana deb yozing.");
  }
}
