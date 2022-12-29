import TelegramBot from 'node-telegram-bot-api';
import { Game1Type } from './models/game1.js';
import { BOT_COMMANDS, BOT_GAME1_OPTIONS } from './options.js';
import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.TOKEN || '';

const bot = new TelegramBot(token, { polling: true });

let games: Game1Type[] = [];

const startGame = async (id: number) => {
  const game = games.find((g) => g.chatId === id);
  if (game) {
    await bot.sendMessage(game.chatId, `You're in the game, you're in the game... keep on playing`);
  }
  const number = Math.floor(Math.random() * 10);
  games.push({ chatId: id, number });
  await bot.sendMessage(id, `I picked a number 0 to 9, guess it!`, BOT_GAME1_OPTIONS);
};

const handleGame1 = async (msg: TelegramBot.CallbackQuery) => {
  if (!msg || !msg.message) {
    return;
  }
  const { data } = msg;
  const { id: cid, username } = msg.message.chat;
  const game = games.find((g) => g.chatId === cid);
  if (game) {
    const attempt = Number(data);
    if (!Number.isNaN(attempt) && attempt / 9 <= 1) {
      if (attempt === game.number) {
        await bot.sendSticker(
          cid,
          'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/3.webp'
        );
        await bot.sendMessage(game.chatId, `Yep, ${username}, it is ${game.number}`);
        games = games.filter((g) => g.chatId !== cid);
        return;
      }
      await bot.sendMessage(game.chatId, `Nope, ${username}, try again`, BOT_GAME1_OPTIONS);
      return;
    }
    await bot.sendMessage(
      game.chatId,
      `You're in the game, ${username}, you're in the game... keep on playing`,
      BOT_GAME1_OPTIONS
    );
    return;
  }
};

const start = async () => {
  bot.setMyCommands(BOT_COMMANDS);

  bot.on('message', async (msg) => {
    const { text } = msg;
    const { id, username, first_name } = msg.chat;

    switch (text) {
      case '/start': {
        bot.sendMessage(id, `Hello, ${first_name}!`);
        break;
      }
      case '/info': {
        bot.sendSticker(
          id,
          'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp'
        );
        bot.sendMessage(id, `This is a test bot playground, ${username}`);
        break;
      }
      case '/game': {
        await startGame(id);
      }
      default: {
        return;
      }
    }
  });

  bot.on('callback_query', async (msg) => {
    return handleGame1(msg);
  });
};

start();
