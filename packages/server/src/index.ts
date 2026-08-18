import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { Bot, InlineKeyboard } from 'grammy';
import { ClientToServerEvents, ServerToClientEvents } from '@boshpana/shared';
import { RoomManager } from './game/RoomManager';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://boshpana.uz';

async function bootstrap() {
  const fastify = Fastify({ logger: true });

  await fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  fastify.get('/health', async () => {
    return { status: 'ok', time: new Date().toISOString() };
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

  // Telegram Bot integration if token is configured
  if (BOT_TOKEN) {
    try {
      const bot = new Bot(BOT_TOKEN);

      bot.command('start', async (ctx) => {
        const keyboard = new InlineKeyboard()
          .webApp('🕹 Boshpanani Boshlash (O\'yin)', WEBAPP_URL)
          .row()
          .url('👥 Guruhga Qo\'shish', `https://t.me/${ctx.me.username}?startgroup=true`);

        await ctx.reply(
          `🚨 <b>BOSHPANA — O'zbekcha Bunker O'yiniga Xush Kelibsiz!</b>\n\n` +
          `Dunyo xavf ostida! Joylar cheklangan yer osti boshpanasiga kirish uchun o'z qobiliyatlaringizni isbotlang.\n\n` +
          `🎮 <b>O'ynash uchun pastdagi tugmani bosing:</b>`,
          { parse_mode: 'HTML', reply_markup: keyboard }
        );
      });

      bot.command('boshpana', async (ctx) => {
        const keyboard = new InlineKeyboard().webApp('🚀 O\'yin Xonasiga Kirish', WEBAPP_URL);
        await ctx.reply(`🚪 <b>Boshpana eshiklari ochilmoqda...</b>`, {
          parse_mode: 'HTML',
          reply_markup: keyboard
        });
      });

      bot.start().catch((e) => console.warn('Bot polling error:', e));
      console.log('Telegram Bot running!');
    } catch (err) {
      console.warn('Telegram Bot setup failed (Token might be invalid or not provided):', err);
    }
  }

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server listening on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
