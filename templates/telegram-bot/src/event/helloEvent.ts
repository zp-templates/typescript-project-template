import { Telegraf } from 'telegraf';

export function helloEvent(bot: Telegraf) {
  bot.on('text', (ctx) => {
    if (ctx.message.text.toLowerCase().includes('hello')) {
      ctx.replyWithHTML('<b>Hello</b>');
    }
  });
}
