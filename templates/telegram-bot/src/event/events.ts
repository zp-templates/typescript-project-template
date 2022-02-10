import { Telegraf } from 'telegraf';

import { helloEvent } from 'event/helloEvent';

export function registerEvent(bot: Telegraf) {
  helloEvent(bot);
}
