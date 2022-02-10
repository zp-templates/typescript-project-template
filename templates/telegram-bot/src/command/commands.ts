import { Telegraf } from 'telegraf';
import { pingCommand } from 'command/pingCommand';

export function registerCommands(bot: Telegraf) {
  pingCommand(bot);
}
