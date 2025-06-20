require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const WEBAPP_URL = process.env.WEBAPP_URL || "https://google.com"; // поставь свой фронт

bot.start(async (ctx) => {
  await ctx.reply(
    'Привет! Я твой помощник. Открой мини-приложение:',
    Markup.keyboard([
      [Markup.button.webApp('🚀 Открыть мини-приложение', WEBAPP_URL)]
    ]).resize()
  );
});

bot.launch();
console.log('Telegram bot started');