import { Bot } from 'grammy';
import { pingCommand } from 'command/pingCommand';

export function registerCommands(bot: Bot) {
  pingCommand(bot);
}
