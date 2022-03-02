import { Bot } from 'grammy';
import { helloEvent } from 'event/helloEvent';

export function registerEvent(bot: Bot) {
  helloEvent(bot);
}
