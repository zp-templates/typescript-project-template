import { Bot } from 'grammy';

export function pingCommand(bot: Bot) {
  bot.on('message').command('ping', async (ctx, next) => {
    await ctx.reply('<b>Pong</b>', { parse_mode: 'HTML' });
    return next();
  });
}
