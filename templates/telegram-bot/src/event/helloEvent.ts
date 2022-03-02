import { Bot } from 'grammy';

export function helloEvent(bot: Bot) {
  bot.on('message:text', async (ctx, next) => {
    if (ctx.msg.text.toLowerCase().includes('hello')) {
      await ctx.reply('<b>Hello</b>', { parse_mode: 'HTML' });
    }
    return next();
  });
}
