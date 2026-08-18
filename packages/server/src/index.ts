import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { Bot, InlineKeyboard } from 'grammy';
import { ClientToServerEvents, ServerToClientEvents } from '@boshpana/shared';
import { RoomManager } from './game/RoomManager';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT || '3001', 10);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://127.0.0.1:4173';

async function bootstrap() {
  const fastify = Fastify({ logger: true });

  await fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

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

  io.on('connection', (socket) => {
    socket.on('createRoom', (payload, cb) => roomManager.createRoom(socket, payload, cb));
    socket.on('joinRoom', (payload, cb) => roomManager.joinRoom(socket, payload, cb));
    socket.on('updateSettings', (settings) => roomManager.updateSettings(socket, settings));
    socket.on('setReady', (isReady) => roomManager.setReady(socket, isReady));
    socket.on('startGame', () => roomManager.startGame(socket));
    socket.on('revealCard', (cat) => roomManager.revealCard(socket, cat));
    socket.on('endPitchTurn', () => roomManager.endPitchTurn(socket));
    socket.on('castVote', (targetId) => roomManager.castVote(socket, targetId));
    socket.on('disconnect', () => roomManager.handleDisconnect(socket));
  });

  // Telegram Bot integration
  if (BOT_TOKEN) {
    try {
      const bot = new Bot(BOT_TOKEN);

      // Set bot command list
      bot.api.setMyCommands([
        { command: 'start', description: '🎮 O\'yinni Boshlash (Mini App)' },
        { command: 'boshpana', description: '🚪 Boshpana xonasi yaratish' },
        { command: 'qoidalar', description: '📜 O\'yin qoidalari va yo\'riqnoma' },
        { command: 'help', description: 'ℹ️ Yordam va ma\'lumot' }
      ]).catch(() => {});

      // /start handler
      bot.command('start', async (ctx) => {
        const startParam = ctx.match; // e.g. /start room_BOSH-123
        const gameUrl = startParam ? `${WEBAPP_URL}?room=${startParam.replace('room_', '')}` : WEBAPP_URL;

        const keyboard = new InlineKeyboard()
          .webApp('🕹 Boshpanani Boshlash (O\'yin)', gameUrl)
          .row()
          .url('👥 Guruhga Qo\'shish', `https://t.me/${ctx.me.username}?startgroup=true`)
          .row()
          .url('📢 Rasmiy Kanal', 'https://t.me/boshpana_game');

        await ctx.reply(
          `🚨 <b>BOSHPANA | O'zbekcha Bunker O'yiniga Xush Kelibsiz!</b>\n\n` +
          `Dunyo bo'ylab global apokalipsis yuz berdi. Faqat cheklangan o'ringa ega yer osti boshpanasiga kirganlargina omon qoladi!\n\n` +
          `🎭 <b>O'yin mexanikasi:</b>\n` +
          `• 1-raundda o'z kasbingizni ochasiz va nega aynan siz kerakligingizni isbotlaysiz\n` +
          `• Keyingi raundlarda qolgan kartalaringizni strategik ochib borasiz\n` +
          `• Har raund so'ngida eng kam foydali deb topilganlar ovoz berish orqali chiqariladi\n` +
          `• Har raunddan so'ng kutilmagan bunker hodisalari yuz beradi\n` +
          `• Finalda algoritm omon qolgan mutaxassislar taqdirini hal qiladi!\n\n` +
          `👇 <b>O'ynash uchun pastdagi tugmani bosing:</b>`,
          { parse_mode: 'HTML', reply_markup: keyboard }
        );
      });

      // /qoidalar handler
      bot.command('qoidalar', async (ctx) => {
        await ctx.reply(
          `📜 <b>BOSHPANA (BUNKER) O'YIN QOIDALARI:</b>\n\n` +
          `1️⃣ <b>Maqsad:</b> Apokalipsis sharoitida o'z xislatlaringizni ko'rsatib, boshpanada omon qolish.\n` +
          `2️⃣ <b>Ishtirokchilar:</b> 4 tadan 16 tagacha o'yinchi.\n` +
          `3️⃣ <b>Kartalar:</b> Kasb, Biologiya, Salomatlik, Bagaj, Xobbi, Fakt va Maxsus qobiliyat.\n` +
          `4️⃣ <b>Ovoz berish:</b> Har raund oxirida ochiq yoki anonim ovoz berish orqali 1 kishi chiqarib yuboriladi.\n` +
          `5️⃣ <b>Simulyatsiya:</b> Qolgan g'oliblarning oziq-ovqat, tibbiyot, texnika va ruhiyat ko'rsatkichlari asosida yakuniy g'alaba hisoblanadi!`,
          { parse_mode: 'HTML' }
        );
      });

      // /boshpana or /game
      bot.command(['boshpana', 'game'], async (ctx) => {
        const keyboard = new InlineKeyboard().webApp('🚀 Xonani Ochish', WEBAPP_URL);
        await ctx.reply(`🚪 <b>Boshpana eshiklari ochilmoqda...</b>\n\nDo'stlaringiz bilan birga o'ynash uchun xonaga kiring:`, {
          parse_mode: 'HTML',
          reply_markup: keyboard
        });
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
