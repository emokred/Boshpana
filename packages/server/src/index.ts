import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Bot, InlineKeyboard } from 'grammy';
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
        { command: 'start', description: '🎮 O\'yinni Boshlash (Mini App)' },
        { command: 'boshpana', description: '🚪 Guruhda o\'yin xonasi ochish' },
        { command: 'stopgame', description: '🛑 Guruh o\'yinini to\'xtatish' },
        { command: 'qoidalar', description: '📜 O\'yin qoidalari va yo\'riqnoma' },
        { command: 'help', description: 'ℹ️ Yordam va ma\'lumot' }
      ]).catch(() => {});

      // /start handler
      bot.command('start', async (ctx) => {
        const startParam = ctx.match; // e.g. /start room_BOSH-123
        const targetUrl = WEBAPP_URL.startsWith('http') ? WEBAPP_URL : `https://${WEBAPP_URL}`;
        const gameUrl = startParam ? `${targetUrl}?room=${startParam.replace('room_', '')}` : targetUrl;

        const keyboard = new InlineKeyboard()
          .webApp('🕹 Boshpanani Boshlash (O\'yin)', gameUrl)
          .row()
          .url('👥 Guruhga Qo\'shish (Guruh Rejimi)', `https://t.me/${ctx.me.username}?startgroup=true`);

        await ctx.reply(
          `🚨 <b>BOSHPANA | O'zbekcha Bunker O'yiniga Xush Kelibsiz!</b>\n\n` +
          `Dunyo bo'ylab global apokalipsis yuz berdi. Faqat cheklangan o'ringa ega yer osti boshpanasiga kirganlargina omon qoladi!\n\n` +
          `🎭 <b>O'yin rejimlari:</b>\n` +
          `1. 📱 <b>Bitta Telefon (Qo'lma-qo'l):</b> Do'stlar davrasida 1 ta telefon orqali o'ynash.\n` +
          `2. 👥 <b>Telegram Guruh Rejimi:</b> Botni guruhga qo'shib /boshpana deb yozing.\n` +
          `3. 🌐 <b>To'liq Online (TMA):</b> Telegram Mini App ichida real vaqtda o'ynash.\n` +
          `4. 🎲 <b>Jonli Davra:</b> Kartalar telefonda, gapirish jonli hayotda.\n\n` +
          `👇 <b>O'ynash uchun pastdagi tugmani bosing:</b>`,
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
        await ctx.reply(
          `📜 <b>BOSHPANA (BUNKER) O'YIN QOIDALARI:</b>\n\n` +
          `1️⃣ <b>Maqsad:</b> Apokalipsis sharoitida o'z xislatlaringizni ko'rsatib, boshpanada omon qolish.\n` +
          `2️⃣ <b>Ishtirokchilar:</b> 3 tadan 16 tagacha o'yinchi.\n` +
          `3️⃣ <b>Kartalar:</b> Kasb, Biologiya, Salomatlik, Bagaj, Xobbi, Fakt va Maxsus qobiliyat.\n` +
          `4️⃣ <b>Ovoz berish:</b> Har raund oxirida ochiq yoki anonim ovoz berish orqali 1 kishi chiqarib yuboriladi.\n` +
          `5️⃣ <b>Simulyatsiya:</b> Qolgan g'oliblarning oziq-ovqat, tibbiyot, texnika va ruhiyat ko'rsatkichlari asosida yakuniy g'alaba hisoblanadi!`,
          { parse_mode: 'HTML' }
        );
      });

      // Callback queries for group game
      bot.callbackQuery(['group_join', 'group_leave', 'group_start', 'group_rules'], async (ctx) => {
        await groupGameManager.handleCallbackQuery(ctx);
      });

      bot.callbackQuery('group_reveal_prof', async (ctx) => {
        await groupGameManager.handleRevealProfession(ctx);
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
