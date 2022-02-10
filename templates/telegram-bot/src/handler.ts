import express, { Request, Response } from 'express';

import { Telegraf } from 'telegraf';
import { getEnv } from 'shared/env';
import { devSetup } from 'devSetup';
import { registerCommands } from 'command/commands';
import { registerEvent } from 'event/events';

export async function handler() {
  const token = process.env.BOT_TOKEN;
  if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!');
  }

  if (getEnv('NODE_ENV') === 'development') {
    await devSetup();
  }

  const bot = new Telegraf(token);

  registerCommands(bot);
  registerEvent(bot);

  const host = getEnv('host');
  const secretPath = `/telegraf/${bot.secretPathComponent()}`;

  await bot.telegram.setWebhook(`${host}${secretPath}`);

  const app = express();
  app.get('/', (req: Request, res: Response) => res.send('Hello World!'));
  // Set the bot API endpoint
  app.use(bot.webhookCallback(secretPath));
  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
}

handler()
  .then(() => console.log('Bot Running'))
  .catch((error) => {
    console.error('Uncaught Error Thrown', error);
  });
