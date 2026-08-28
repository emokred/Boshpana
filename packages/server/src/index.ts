import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import { ClientToServerEvents, ServerToClientEvents, CardCategory, RoomSettings } from '@boshpana/shared';
import { RoomManager } from './game/RoomManager';
import { TelegramGroupGameManager } from './bot/TelegramGroupGame';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT || '3001', 10);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || process.env.RENDER_EXTERNAL_URL || 'https://boshpana.onrender.com';
const SUPER_ADMIN_ID = 6377617416; // User's Telegram ID

async function bootstrap() {
  const fastify = Fastify({ logger: true });

  await fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  // Serve static client bundle if built
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    await fastify.register(fastifyStatic, {
      root: clientDistPath,
      prefix: '/'
    });

    fastify.setNotFoundHandler((req, reply) => {
      reply.sendFile('index.html');
    });
  }

  fastify.get('/health', async () => {
    return { status: 'ok', botActive: !!BOT_TOKEN, time: new Date().toISOString() };
  });

  // Attach Socket.io to Fastify's raw http server
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(fastify.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const roomManager = new RoomManager(io);

  io.on('connection', (socket: Socket) => {
    socket.on('createRoom', (payload: any, cb: any) => roomManager.createRoom(socket, payload, cb));
    socket.on('joinRoom', (payload: any, cb: any) => roomManager.joinRoom(socket, payload, cb));
    socket.on('updateSettings', (settings: Partial<RoomSettings>) => roomManager.updateSettings(socket, settings));
    socket.on('setReady', (isReady: boolean) => roomManager.setReady(socket, isReady));
    socket.on('startGame', () => roomManager.startGame(socket));
    socket.on('revealCard', (cat: CardCategory) => roomManager.revealCard(socket, cat));
    socket.on('endPitchTurn', () => roomManager.endPitchTurn(socket));
    socket.on('castVote', (targetId: string) => roomManager.castVote(socket, targetId));
    socket.on('disconnect', () => roomManager.handleDisconnect(socket));
  });

  // Telegram Bot integration
  if (BOT_TOKEN) {
    try {
      const bot = new Bot(BOT_TOKEN);
      const groupGameManager = new TelegramGroupGameManager(bot);

      // Set bot command list
      bot.api.setMyCommands([
        { command: 'start', description: '🎮 Asosiy Menyu & O\'yin' },
        { command: 'cards', description: '🎴 Mening Kartalarim (Lichka)' },
        { command: 'boshpana', description: '🚪 Guruhda o\'yin xonasi ochish' },
        { command: 'stopgame', description: '🛑 Guruh o\'yinini to\'xtatish' },
        { command: 'qoidalar', description: '📜 O\'yin qoidalari va yo\'riqnoma' },
        { command: 'help', description: 'ℹ️ Yordam va ma\'lumot' }
      ]).catch(() => {});

      // Helper to build persistent bottom reply keyboard
      const getPersistentMenu = (userId?: number) => {
        const targetUrl = WEBAPP_URL.startsWith('http') ? WEBAPP_URL : `https://${WEBAPP_URL}`;
        const kb = new Keyboard()
          .webApp('🕹 O\'yinni Boshlash (Mini App)', targetUrl)
          .text('🎴 Mening Kartalarim')
          .row()
          .text('📜 O\'yin Qoidalari')
          .text('ℹ️ Yordam & Ma\'lumot');

        if (userId === SUPER_ADMIN_ID) {
          kb.row().webApp('🖨️ VIP: PDF Chop Etish (Admin)', targetUrl);
        }

        return kb.resized().persistent();
      };

      // Helper for interactive Rules Menu
      const renderRulesMenu = async (ctx: any, section: 'main' | 'quick' | 'full' | 'player' | 'host') => {
        const keyboard = new InlineKeyboard();

        if (section === 'main') {
          keyboard
            .text('⚡ Qisqa (1 daqiqalik)', 'rules_quick')
            .text('📖 To\'liq Qoidalar', 'rules_full')
            .row()
            .text('🧑‍💼 O\'yinchi Taktikasi', 'rules_player')
            .text('👑 Host Qo\'llanmasi', 'rules_host');

          await ctx.reply(
            `📜 <b>BOSHPANA | O'YIN QOIDALARI MARKAZI:</b>\n\n` +
            `O'yin qoidalarini qaysi ko'rinishda o'rganmoqchisiz? Quyidagi bo'limlardan birini tanlang:`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        } else if (section === 'quick') {
          keyboard
            .text('📖 To\'liq Qoidalar', 'rules_full')
            .text('🧑‍💼 O\'yinchi Taktikasi', 'rules_player')
            .row()
            .text('⬅️ Qoidalar Menusiga Qaytish', 'rules_main');

          await ctx.reply(
            `⚡ <b>BOSHPANA: 1 DAQIQALIK QISQA YO'RIQNOMA</b>\n\n` +
            `1️⃣ <b>Global Apokalipsis:</b> Dunyoda falokat yuz berdi. Boshpanada atigi 2-3 kishilik joy bor.\n` +
            `2️⃣ <b>7 Ta Karta:</b> Har kimga Kasb, Biologiya, Salomatlik, Bagaj, Xobbi, Fakt va Maxsus karta beriladi.\n` +
            `3️⃣ <b>1-Raund:</b> Hamma o'z kasbini ochib, nega kerakligini isbotlaydi.\n` +
            `4️⃣ <b>2-Raund+:</b> O'zingiz xohlagan boshqa kartangizni ochasiz va bahslashasiz.\n` +
            `5️⃣ <b>Ovoz Berish:</b> Har raund oxirida eng keraksiz deb topilgan 1 kishi chiqarib yuboriladi!\n` +
            `6️⃣ <b>G'alaba:</b> Faqat eng kuchli va bir-birini to'ldiruvchi guruh omon qoladi!`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        } else if (section === 'full') {
          keyboard
            .text('🧑‍💼 O\'yinchi Taktikasi', 'rules_player')
            .text('👑 Host Qo\'llanmasi', 'rules_host')
            .row()
            .text('⬅️ Qoidalar Menusiga Qaytish', 'rules_main');

          await ctx.reply(
            `📖 <b>BOSHPANA: TO'LIQ VA BATAFSIL QOIDALAR</b>\n\n` +
            `• <b>O'yinchilar soni:</b> 3 tadan 16 tagacha.\n` +
            `• <b>O'yin maqsadi:</b> O'z xislatlaringizni himoya qilish, boshqalarning zaif nuqtalarini ko'rsatish va boshpana eshigi yopilgunicha omon qolish.\n\n` +
            `• <b>Kartalar kategoriyalari:</b>\n` +
            `  - 🩺 <b>Kasb:</b> Boshpanadagi asosiy vazifangiz.\n` +
            `  - 🧬 <b>Biologiya:</b> Yoshi, jinsi, nasl qoldirish salohiyati.\n` +
            `  - 💚 <b>Salomatlik:</b> Immunitet yoki surunkali kasallik.\n` +
            `  - 🎒 <b>Bagaj:</b> O'zingiz bilan olib kirgan asbob/oziq-ovqat.\n` +
            `  - ✨ <b>Xobbi:</b> Qo'shimcha foydali hunar.\n` +
            `  - 📜 <b>Fakt:</b> Yashirin o'tmish yoki maxfiy bilim.\n` +
            `  - ⚡ <b>Maxsus:</b> O'yin qoidalarini o'zgartiruvchi karta (Veto, Rokirovka, Qo'sh ovoz).\n\n` +
            `• <b>Final Simulyatsiyasi:</b> G'oliblar saralangach, algoritm ularning Oziq-ovqat, Tibbiyot, Texnika va Ruhiyat ballarini hisoblab, boshpana necha yil yashay olishini simulyatsiya qiladi!`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        } else if (section === 'player') {
          keyboard
            .text('👑 Host Qo\'llanmasi', 'rules_host')
            .text('⚡ Qisqa Yo\'riqnoma', 'rules_quick')
            .row()
            .text('⬅️ Qoidalar Menusiga Qaytish', 'rules_main');

          await ctx.reply(
            `🧑‍💼 <b>ODDIY O'YINCHI UCHUN STRATEGIYA VA TAKTIKA:</b>\n\n` +
            `💡 <b>1. Yomon kartangizni darhol ochmang:</b> Agar kasalligingiz og'ir bo'lsa yoki kasbingiz kuchsiz bo'lsa, 2-raundda o'zingizning kuchli Bagajingiz yoki Xobbiyingizni ochib jamoaga kerakligingizni ko'rsating!\n` +
            `💡 <b>2. Falokat turiga e'tibor bering:</b> Agar "Yadro Qishi" bo'lsa — Muhandis va Olov yoquvchilar qirol. Agar "Epidemiya" bo'lsa — Shifokor va Dorilar muhim!\n` +
            `💡 <b>3. Ittifoq tuzing:</b> O'xshash yoki bir-birini to'ldiruvchi o'yinchilar bilan davrada kelishib, xavfli raqiblarni chiqarib yuboring.\n` +
            `💡 <b>4. Maxsus kartani asrab qo'ying:</b> "Veto" yoki "Kasb almashtirish" kartasini ovoz berishda o'zingizga xavf tug'ilgandagina ishlating!`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        } else if (section === 'host') {
          keyboard
            .text('🧑‍💼 O\'yinchi Taktikasi', 'rules_player')
            .text('📖 To\'liq Qoidalar', 'rules_full')
            .row()
            .text('⬅️ Qoidalar Menusiga Qaytish', 'rules_main');

          await ctx.reply(
            `👑 <b>XONA EGASI (HOST) UCHUN BOSHQARUV QO'LLANMASI:</b>\n\n` +
            `🎯 <b>1. Rejimni to'g'ri tanlang:</b>\n` +
            `   - Do'stlar davrasida faqat 1 ta telefon bo'lsa ➡️ <b>Bitta Telefon (Pass & Play)</b> rejimini yoqing.\n` +
            `   - Har kim o'z telefonida o'tirgan bo'lsa ➡️ <b>Jonli Davra (Gibrid)</b> rejimini oching.\n` +
            `   - Telegram guruhda bo'lsangiz ➡️ <b>/boshpana</b> deb yozib guruh botini ishga tushiring.\n\n` +
            `⏱ <b>2. Vaqtni nazorat qiling:</b> Har bir o'yinchining nutqi 45-60 soniyadan oshmasin. Bahsda janjal bo'lmasligi uchun navbat bilan so'z bering.\n` +
            `⚖️ <b>3. Durang holatlari:</b> Agar ovozlar teng kelib qolsa, tizim avtomatik tasodifiy tanlov qiladi yoki o'rtada 30 soniyalik qo'shimcha himoya nutqi beriladi.`,
            { parse_mode: 'HTML', reply_markup: keyboard }
          );
        }
      };

      // /start handler with persistent keyboard + inline dashboard
      bot.command('start', async (ctx) => {
        const startParam = ctx.match; // e.g. /start room_BOSH-123
        const targetUrl = WEBAPP_URL.startsWith('http') ? WEBAPP_URL : `https://${WEBAPP_URL}`;
        const gameUrl = startParam ? `${targetUrl}?room=${startParam.replace('room_', '')}` : targetUrl;
        const userId = ctx.from?.id;

        const inlineKeyboard = new InlineKeyboard()
          .webApp('🕹 Boshpanani Boshlash (Mini App)', gameUrl)
          .row()
          .url('👥 Guruhga Qo\'shish (Guruh Rejimi)', `https://t.me/${ctx.me.username}?startgroup=true`)
          .row()
          .text('🎴 Mening Maxfiy Kartalarim', 'dm_my_cards')
          .text('📜 Qoidalar Markazi', 'rules_main');

        // Only show PDF button to Super Admin
        if (userId === SUPER_ADMIN_ID) {
          inlineKeyboard.row().webApp('🖨️ VIP: Kartalarni Chop Etish (Admin PDF)', targetUrl);
        }

        const persistentMenu = getPersistentMenu(userId);

        await ctx.reply(
          `🚨 <b>BOSHPANA | O'zbekcha Bunker O'yiniga Xush Kelibsiz!</b>\n\n` +
          `Dunyo bo'ylab global apokalipsis yuz berdi. Faqat cheklangan o'ringa ega yer osti boshpanasiga kirganlargina omon qoladi!\n\n` +
          `🎭 <b>4 Xil O'yin Rejimi:</b>\n` +
          `1. 📱 <b>Bitta Telefon (Qo'lma-qo'l):</b> Do'stlar davrasida 1 ta telefon orqali o'ynash.\n` +
          `2. 👥 <b>Telegram Guruh Rejimi:</b> Botni guruhga qo'shib /boshpana deb yozing.\n` +
          `3. 🌐 <b>To'liq Online (TMA):</b> Telegram Mini App ichida real vaqtda o'ynash.\n` +
          `4. 🎲 <b>Jonli Davra (Gibrid):</b> Kartalar telefonda, tortishuv jonli hayotda!\n\n` +
          `👇 <b>Quyidagi tugmalardan birini tanlang:</b>`,
          { 
            parse_mode: 'HTML', 
            reply_markup: inlineKeyboard
          }
        );

        // Also send persistent bottom reply keyboard
        await ctx.reply("📌 <i>Pastki doimiy menyu tugmalari faollashtirildi:</i>", {
          parse_mode: 'HTML',
          reply_markup: persistentMenu
        });
      });

      // Handle bottom persistent menu text buttons
      bot.hears('🎴 Mening Kartalarim', async (ctx) => {
        const keyboard = new InlineKeyboard()
          .text('🩺 Kasb', 'dm_card_profession')
          .text('🧬 Biologiya', 'dm_card_biology')
          .row()
          .text('💚 Salomatlik', 'dm_card_health')
          .text('🎒 Bagaj', 'dm_card_baggage')
          .row()
          .text('✨ Xobbi', 'dm_card_hobby')
          .text('📜 Fakt', 'dm_card_fact')
          .row()
          .text('⚡ Maxsus Qobiliyat', 'dm_card_special');

        await ctx.reply(
          `🎴 <b>Sizning Boshpana Kartalaringiz (Interaktiv Lichka):</b>\n\n` +
          `Kartangiz xususiyatini ko'rish uchun quyidagi tugmalardan birini bosing:`,
          { parse_mode: 'HTML', reply_markup: keyboard }
        );
      });

      bot.hears('📜 O\'yin Qoidalari', async (ctx) => {
        await renderRulesMenu(ctx, 'main');
      });

      bot.hears('ℹ️ Yordam & Ma\'lumot', async (ctx) => {
        await ctx.reply(
          `ℹ️ <b>BOSHPANA O'YINI HAQIDA:</b>\n\n` +
          `🏢 <b>Loyiha:</b> Boshpana — O'zbek milliy koloritiga ega ijtimoiy apokalipsis stol o'yini.\n` +
          `👨‍💻 <b>Muallif & Admin:</b> @emokred\n` +
          `📦 <b>Stol o'yini mahsulotiga buyurtma berish:</b> @emokred ga yozing.\n` +
          `🚀 <b>Jonli versiya:</b> https://boshpana.onrender.com`,
          { parse_mode: 'HTML' }
        );
      });

      // /cards command in DM
      bot.command('cards', async (ctx) => {
        const keyboard = new InlineKeyboard()
          .text('🩺 Kasb', 'dm_card_profession')
          .text('🧬 Biologiya', 'dm_card_biology')
          .row()
          .text('💚 Salomatlik', 'dm_card_health')
          .text('🎒 Bagaj', 'dm_card_baggage')
          .row()
          .text('✨ Xobbi', 'dm_card_hobby')
          .text('📜 Fakt', 'dm_card_fact')
          .row()
          .text('⚡ Maxsus Qobiliyat', 'dm_card_special');

        await ctx.reply(
          `🎴 <b>Sizning Boshpana Kartalaringiz (Interaktiv Lichka):</b>\n\n` +
          `Kartangiz xususiyatini ko'rish uchun quyidagi tugmalardan birini bosing:`,
          { parse_mode: 'HTML', reply_markup: keyboard }
        );
      });

      // /boshpana or /game in group
      bot.command(['boshpana', 'game', 'startgame'], async (ctx) => {
        if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
          await groupGameManager.handleStartLobby(ctx);
        } else {
          const targetUrl = WEBAPP_URL.startsWith('http') ? WEBAPP_URL : `https://${WEBAPP_URL}`;
          const keyboard = new InlineKeyboard()
            .webApp('🚀 Xonani Ochish', targetUrl)
            .row()
            .url('👥 Guruhga Qo\'shish', `https://t.me/${ctx.me.username}?startgroup=true`);

          await ctx.reply(`🚪 <b>Boshpana eshiklari ochilmoqda...</b>\n\nDo'stlaringiz bilan guruhda yoki Mini Appda o'ynang:`, {
            parse_mode: 'HTML',
            reply_markup: keyboard
          });
        }
      });

      // /stopgame
      bot.command('stopgame', async (ctx) => {
        if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
          await groupGameManager.handleStopGame(ctx);
        }
      });

      // /qoidalar handler
      bot.command('qoidalar', async (ctx) => {
        await renderRulesMenu(ctx, 'main');
      });

      // Universal callback queries router (Fixes any freeze / infinite loading spinner)
      bot.on('callback_query:data', async (ctx) => {
        const data = ctx.callbackQuery.data;
        await ctx.answerCallbackQuery().catch(() => {});

        if (data.startsWith('rules_')) {
          const section = data.replace('rules_', '') as any;
          await renderRulesMenu(ctx, section);
          return;
        }

        if (data === 'dm_my_cards') {
          const keyboard = new InlineKeyboard()
            .text('🩺 Kasb', 'dm_card_profession')
            .text('🧬 Biologiya', 'dm_card_biology')
            .row()
            .text('💚 Salomatlik', 'dm_card_health')
            .text('🎒 Bagaj', 'dm_card_baggage')
            .row()
            .text('✨ Xobbi', 'dm_card_hobby')
            .text('📜 Fakt', 'dm_card_fact')
            .row()
            .text('⚡ Maxsus Qobiliyat', 'dm_card_special');

          await ctx.reply(`🎴 <b>Mening Kartalarim (Interaktiv):</b>\nBatafsil ko'rish uchun tanlang:`, {
            parse_mode: 'HTML',
            reply_markup: keyboard
          });
          return;
        }

        await groupGameManager.handleCallbackQuery(ctx);
      });

      bot.start({
        onStart: (info) => {
          console.log(`🤖 Telegram Bot @${info.username} muvaffaqiyatli ishga tushdi!`);
        }
      }).catch((e) => console.warn('Bot polling warning:', e));
    } catch (err) {
      console.warn('Telegram Bot init error:', err);
    }
  }

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server listening on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
