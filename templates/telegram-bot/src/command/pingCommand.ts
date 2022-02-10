import { Telegraf } from 'telegraf';

export function pingCommand(bot: Telegraf) {
  bot.command('ping', (ctx) => {
    ctx.replyWithHTML('<b>Pong</b>');
  });
}
