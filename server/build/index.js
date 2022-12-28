import TelegramBot from 'node-telegram-bot-api';
import { testModule } from './modules/test.js';
const token = '5673896181:AAGxGb7zqGclP3Y4TtjtIk9OdRCdhr-Si0w';
const bot = new TelegramBot(token, { polling: true });
bot.on('message', (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log('msg', msg);
    testModule(text);
});
//# sourceMappingURL=index.js.map