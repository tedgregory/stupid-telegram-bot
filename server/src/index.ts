import TelegramBot from 'node-telegram-bot-api';
import { Game1Type } from './models/game1.js';

const token = '5673896181:AAGxGb7zqGclP3Y4TtjtIk9OdRCdhr-Si0w';

const bot = new TelegramBot(token, { polling: true });

let games: Game1Type[] = [];

const start = async () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start working' },
    { command: '/info', description: 'About and options' },
    { command: '/game', description: 'Play stupid game' },
  ]);

  bot.on('message', async (msg) => {
    const { text } = msg;
    const { id, username, first_name } = msg.chat;
    const game = games.find((g) => g.chatId === id);
    if (game) {
      const attempt = Number(text);
      if (!Number.isNaN(attempt) && attempt / 9 <= 1) {
        if (attempt === game.number) {
          await bot.sendSticker(
            id,
            'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/3.webp'
          );
          await bot.sendMessage(game.chatId, `Yep, ${username}, it is ${game.number}`);
          games = games.filter((g) => g.chatId !== id);
          return;
        }
        await bot.sendMessage(game.chatId, `Nope, ${username}, try again`);
        return;
      }
      await bot.sendMessage(
        game.chatId,
        `You're in the game, ${username}, you're in the game... keep on playing`
      );
      return;
    }
    console.log(msg);
    switch (text) {
      case '/start': {
        await bot.sendMessage(id, `Hello, ${first_name}!`);
        break;
      }
      case '/info': {
        await bot.sendSticker(
          id,
          'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp'
        );
        await bot.sendMessage(id, `This is a test bot playground, ${username}`);
        break;
      }
      case '/game': {
        const game = games.find((g) => g.chatId === id);
        if (game) {
          await bot.sendMessage(
            game.chatId,
            `You're in the game, ${username}, you're in the game... keep on playing`
          );
          break;
        }
        const number = Math.floor(Math.random() * 10);
        games.push({ chatId: id, number });
        await bot.sendMessage(id, `I picked a number 0 to 9, ${username}, guess it!`);
      }
      default: {
        await bot.sendMessage(id, 'Wtf man! I aint gecha!');
      }
    }
  });
};

start();
