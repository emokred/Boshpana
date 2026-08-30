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
  private userActiveGames: Map<number, number> = new Map(); // userId -> chatId

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
    this.userActiveGames.set(hostId, chatId);

    this.games.set(chatId, newGame);
    await this.renderLobbyMessage(ctx, newGame);
  }

  private async renderLobbyMessage(ctx: Context, game: GroupGameState, messageIdToEdit?: number) {
    const keyboard = new InlineKeyboard()
      .text('➕ O\'yinga Qo\'shilish (Join)', 'group_join')
      .row()
      .text('🚀 O\'yinni Boshlash (Start)', 'group_start')
      .text('📜 Qoidalar', 'group_rules');

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

  // ================= 2. UNIVERSAL CALLBACK QUERY HANDLER =================
  public async handleCallbackQuery(ctx: Context) {
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    // Always answer callback query first to prevent Telegram freeze/spinner
    await ctx.answerCallbackQuery().catch(() => {});

    // DM Card Inspection
    if (data.startsWith('dm_card_')) {
      const catKey = data.replace('dm_card_', '') as CardCategory;
      await this.handleDMPeekCard(ctx, catKey);
      return;
    }

    const chatId = ctx.chat?.id || this.userActiveGames.get(ctx.from!.id);
    if (!chatId) return;

    const game = this.games.get(chatId);
    if (!game) return;

    const userId = ctx.from!.id;
    const userName = ctx.from!.first_name || 'O\'yinchi';

    // JOIN / LEAVE TOGGLE
    if (data === 'group_join') {
      if (game.phase !== 'LOBBY') return;

      // If user already in game, clicking toggles leave gracefully for them
      if (game.players.has(userId)) {
        if (userId === game.hostId && game.players.size > 1) {
          game.players.delete(userId);
          game.playerOrder = game.playerOrder.filter(id => id !== userId);
          game.hostId = game.playerOrder[0];
          game.hostName = game.players.get(game.hostId)?.name || 'Host';
        } else {
          game.players.delete(userId);
          game.playerOrder = game.playerOrder.filter(id => id !== userId);
        }
        this.userActiveGames.delete(userId);

        if (game.players.size === 0) {
          this.games.delete(chatId);
          return;
        }

        await this.renderLobbyMessage(ctx, game, ctx.callbackQuery?.message?.message_id);
        return;
      }

      if (game.players.size >= 16) return;

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
      this.userActiveGames.set(userId, chatId);

      await this.renderLobbyMessage(ctx, game, ctx.callbackQuery?.message?.message_id);
      return;
    }

    // LEAVE
    if (data === 'group_leave') {
      if (game.phase !== 'LOBBY') return;
      if (!game.players.has(userId)) return;

      game.players.delete(userId);
      game.playerOrder = game.playerOrder.filter(id => id !== userId);
      this.userActiveGames.delete(userId);

      if (userId === game.hostId && game.playerOrder.length > 0) {
        game.hostId = game.playerOrder[0];
        game.hostName = game.players.get(game.hostId)?.name || 'Host';
      }

      if (game.players.size === 0) {
        this.games.delete(chatId);
        return;
      }

      await this.renderLobbyMessage(ctx, game, ctx.callbackQuery?.message?.message_id);
      return;
    }

    // RULES
    if (data === 'group_rules') {
      await ctx.reply(
        `📜 <b>BOSHPANA GURUH QOIDALARI:</b>\n\n` +
        `1. Bot sizga shaxsiy xabarda (Lichkada) 7 ta maxfiy kartangizni yuboradi.\n` +
        `2. 1-raundda hamma o'z Kasbini guruhga e'lon qiladi.\n` +
        `3. Guruh Ovozli Chatida (Voice Chat) kim kerakligini tortishasiz.\n` +
        `4. Raund oxirida guruh so'rovnomasi (Poll) orqali 1 kishi chiqarib yuboriladi!\n` +
        `5. Qolgan 2 ta omon qoluvchi bilan g'alaba hisoblanadi!`,
        { parse_mode: 'HTML' }
      );
      return;
    }

    // START GAME (PROMPT GROUP GAME MODE)
    if (data === 'group_start') {
      if (userId !== game.hostId) return;
      if (game.players.size < 3) {
        await ctx.reply("⚠️ O'yinni boshlash uchun kamida 3 nafar o'yinchi kerak!");
        return;
      }

      const modeKeyboard = new InlineKeyboard()
        .text('🗳️ 1. Matn & So\'rovnomalar (Polls)', 'group_mode_poll')
        .row()
        .text('🎙️ 2. Guruh Ovozli Chat (Voice Chat)', 'group_mode_voice')
        .row()
        .text('🕹️ 3. Mini App Guruh Xonasi (TMA)', 'group_mode_tma');

      await ctx.reply(
        `🎮 <b>Guruh O'yin Rejimini Tanlang:</b>\n\n` +
        `1. <b>🗳️ Matn & So'rovnomalar:</b> Bot kartalarni lichkaga yuboradi, guruhda ovoz berish so'rovnomalari o'tkaziladi.\n` +
        `2. <b>🎙️ Guruh Ovozli Chat:</b> O'yinchilar Telegram Voice Chatida gaplashadi, bot raundlarni boshqaradi.\n` +
        `3. <b>🕹️ Mini App Xonasi:</b> Guruh uchun yagona sinxron Mini App havolasi yaratiladi.`,
        { parse_mode: 'HTML', reply_markup: modeKeyboard }
      );
      return;
    }

    if (data === 'group_mode_poll' || data === 'group_mode_voice' || data === 'group_mode_tma') {
      if (userId !== game.hostId) return;
      await this.startGame(ctx, game, data);
      return;
    }

    // RE-SEND CARDS TO DM
    if (data === 'group_my_cards') {
      const player = game.players.get(userId);
      if (player) {
        await this.sendPrivateCards(player);
      }
      return;
    }

    // REVEAL CARD IN GROUP
    if (data.startsWith('group_reveal_')) {
      const cat = data.replace('group_reveal_', '') as CardCategory;
      await this.handleRevealCategory(ctx, game, userId, cat);
      return;
    }
  }

  // ================= 3. START GAME & DEAL CARDS =================
  private async startGame(ctx: Context, game: GroupGameState, groupMode: string = 'group_mode_poll') {
    game.phase = 'ROUND_PITCH';
    const categories: CardCategory[] = ['profession', 'biology', 'health', 'baggage', 'hobby', 'fact', 'special'];

    // Deal unique cards to each player
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

      // Send private DM with interactive card buttons
      await this.sendPrivateCards(player);
    }

    const modeName = groupMode === 'group_mode_voice' 
      ? '🎙️ Guruh Ovozli Chat (Voice Chat) Rejimi' 
      : groupMode === 'group_mode_tma'
      ? '🕹️ Mini App Guruh Xonasi'
      : '🗳️ Matn & So\'rovnomalar Rejimi';

    // Announce Catastrophe in Group
    const catastropheMsg = 
      `🚨 <b>FALOKAT YUZ BERDI: ${game.catastrophe.title.toUpperCase()}!</b>\n\n` +
      `🎮 <b>Tanlangan Rejim:</b> <i>${modeName}</i>\n` +
      `📖 <b>Tafsilot:</b> ${game.catastrophe.shortDesc}\n\n` +
      `🏛 <b>Boshpana:</b> Maydoni ${game.shelterSpecs.areaSqMeters} kv.m, ${game.catastrophe.shelterMonths} oylik resurs.\n` +
      `⚠️ <b>Xavflar:</b> ${game.catastrophe.hazards.join(', ')}\n` +
      `🎯 <b>Boshpanaga faqat ${game.targetSurvivors} nafar eng kerakli mutaxassis kira oladi!</b>\n\n` +
      `📩 <i>Har bir o'yinchining shaxsiyiga (Lichkaga) maxfiy kartalari yuborildi!</i>\n\n` +
      `👇 <b>1-RAUND: KASBLAR JANGI!</b>\n` +
      `O'z kasbingizni guruhga ochish uchun pastdagi tugmani bosing:`;

    const keyboard = new InlineKeyboard()
      .text('🩺 Kasbimni Hammaga Ochish', 'group_reveal_profession')
      .row()
      .text('📩 Mening Kartalarim (Lichka)', 'group_my_cards');

    await ctx.api.sendMessage(game.chatId, catastropheMsg, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }

  // Send private cards with interactive buttons to DM
  public async sendPrivateCards(player: GroupPlayer) {
    try {
      const keyboard = new InlineKeyboard()
        .text(`🩺 Kasb: ${player.cards.profession?.card?.title || '???'}`, 'dm_card_profession')
        .row()
        .text(`🧬 Biologiya: ${player.cards.biology?.card?.title || '???'}`, 'dm_card_biology')
        .row()
        .text(`💚 Salomatlik: ${player.cards.health?.card?.title || '???'}`, 'dm_card_health')
        .row()
        .text(`🎒 Bagaj: ${player.cards.baggage?.card?.title || '???'}`, 'dm_card_baggage')
        .row()
        .text(`✨ Xobbi: ${player.cards.hobby?.card?.title || '???'}`, 'dm_card_hobby')
        .row()
        .text(`📜 Fakt: ${player.cards.fact?.card?.title || '???'}`, 'dm_card_fact')
        .row()
        .text(`⚡ Maxsus: ${player.cards.special?.card?.title || '???'}`, 'dm_card_special');

      const dmText = 
        `🎴 <b>Sizning Maxfiy Boshpana Kartalaringiz (Interaktiv):</b>\n\n` +
        `Batafsil ma'lumot olish uchun quyidagi kartalardan birini bosing:\n` +
        `<i>Eslatma: Guruhda navbatingiz kelganda kerakli kartani oching!</i>`;

      await this.bot.api.sendMessage(player.id, dmText, { 
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    } catch (err) {
      console.warn(`Could not send DM to player ${player.id}. User needs to /start bot.`);
    }
  }

  // Handle DM Peek on a specific card
  private async handleDMPeekCard(ctx: Context, category: CardCategory) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const chatId = this.userActiveGames.get(userId);
    const game = chatId ? this.games.get(chatId) : null;
    const player = game?.players.get(userId);

    if (!player || !player.cards[category]) {
      await ctx.reply(`ℹ️ <b>[${category.toUpperCase()}]:</b> Hozircha faol o'yin kartangiz yo'q. Guruhda /boshpana buyrug'ini bering.`);
      return;
    }

    const slot = player.cards[category];
    const infoText = 
      `🎴 <b>[${category.toUpperCase()}] KARTANGIZ:</b>\n\n` +
      `🏷 <b>Nomi:</b> <b>${slot.card.title}</b>\n` +
      `📝 <b>Ta'rifi:</b> <i>${slot.card.description || 'Xususiyat'}</i>\n` +
      `👁 <b>Holati:</b> ${slot.isRevealed ? '🟢 Hammaga Ochiq' : '🔒 Maxfiy (Faqat sizga ko\'rinadi)'}`;

    await ctx.reply(infoText, { parse_mode: 'HTML' });
  }

  // Reveal Card Category in Group Chat
  private async handleRevealCategory(ctx: Context, game: GroupGameState, userId: number, category: CardCategory) {
    const player = game.players.get(userId);
    if (!player) return;

    const slot = player.cards[category];
    if (!slot) return;

    if (slot.isRevealed) {
      await ctx.reply(`ℹ️ <b>${player.name}</b> allaqachon [${category.toUpperCase()}] kartasini ochgan.`);
      return;
    }

    slot.isRevealed = true;

    await ctx.api.sendMessage(
      game.chatId,
      `📢 <b>${player.name}</b> o'z kartasini ochdi:\n` +
      `👉 <b>[${category.toUpperCase()}]:</b> <b>${slot.card.title}</b>\n` +
      `<i>"${slot.card.description || 'Xususiyat'}"</i>`,
      { parse_mode: 'HTML' }
    );

    // Check if all alive players revealed current round requirement
    const alivePlayers = Array.from(game.players.values()).filter(p => p.isAlive);
    const allRevealed = alivePlayers.every(p => p.cards[category]?.isRevealed);

    if (allRevealed) {
      await this.startDebateAndVoting(ctx, game);
    }
  }

  // Start Debate & Poll Voting in group
  private async startDebateAndVoting(ctx: Context, game: GroupGameState) {
    game.phase = 'DEBATE';

    await ctx.api.sendMessage(
      game.chatId,
      `🗣 <b>BARCHA KARTALAR OCHILDI!</b>\n\n` +
      `Endi guruhda (yoki Guruh Ovozli Chatida) 45 soniya davomida kim eng kam foydali ekanini muhokama qiling!\n\n` +
      `⏱ <i>45 soniyadan so'ng chiqarib yuborish bo'yicha so'rovnoma (Ovoz berish) boshlanadi!</i>`,
      { parse_mode: 'HTML' }
    );

    // Wait 40 seconds then trigger Poll Voting
    setTimeout(async () => {
      await this.launchVotingPoll(game);
    }, 40000);
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
          open_period: 40 // 40 seconds to vote
        }
      );
      game.votingPollMessageId = pollMsg.message_id;

      // Schedule poll resolution after 41 seconds
      setTimeout(async () => {
        await this.resolveGroupVoting(game);
      }, 41000);
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

    const victimCardsSummary = Object.entries(victim.cards)
      .map(([cat, slot]) => `• <b>[${cat.toUpperCase()}]:</b> ${slot?.card?.title || 'Noma\'lum'}`)
      .join('\n');

    await this.bot.api.sendMessage(
      game.chatId,
      `💀 <b>OVOZ BERISH NATIJASI:</b>\n\n` +
      `❌ <b>${victim.name}</b> (${victim.cards.profession?.card?.title || 'Kasbi noma\'lum'}) boshpanadan chiqarib yuborildi!\n\n` +
      `🔍 <b>Uning barcha yashirin kartalari ochildi:</b>\n${victimCardsSummary}\n\n` +
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
      }, 8000);
    }
  }

  private async startNextGroupRound(game: GroupGameState) {
    game.phase = 'ROUND_PITCH';
    const categories: CardCategory[] = ['biology', 'health', 'baggage', 'hobby', 'fact', 'special'];
    const currentCat = categories[(game.roundNumber - 2) % categories.length];

    const keyboard = new InlineKeyboard()
      .text(`🔓 [${currentCat.toUpperCase()}] Kartamni Ochish`, `group_reveal_${currentCat}`)
      .row()
      .text('📩 Mening Kartalarim (Lichka)', 'group_my_cards');

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
