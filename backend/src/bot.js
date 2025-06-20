require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// Проверка токена и ссылки
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'OK' : 'NOT FOUND');
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const WEBAPP_URL = process.env.WEBAPP_URL || "https://google.com"; // поставь свой фронт

bot.start(async (ctx) => {
  console.log('Получена команда /start от пользователя:', ctx.from.username || ctx.from.id);
  await ctx.reply(
    'Привет! Я твой помощник. Открой мини-приложение:',
    Markup.keyboard([
      [Markup.button.webApp('🚀 Открыть мини-приложение', WEBAPP_URL)]
    ]).resize()
  );
});

// Логирование всех сообщений для отладки
bot.on('message', (ctx) => {
  console.log('Поступило сообщение:', ctx.message.text, 'от', ctx.from.username || ctx.from.id);
});

bot.launch();
console.log('Telegram bot started');
