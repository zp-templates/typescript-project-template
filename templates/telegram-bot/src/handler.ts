import express, { json } from 'express';

import { getEnv } from 'shared/env';
import { devSetup } from 'devSetup';
import { Bot, webhookCallback } from 'grammy';
import { v4 as uuid } from 'uuid';
import { registerCommands } from 'command/commands';
import { registerEvent } from 'event/events';

export async function handler(): Promise<void> {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    throw new Error('BOT_TOKEN must be provided!');
  }

  if (getEnv('NODE_ENV') === 'development') {
    await devSetup();
  }

  const bot = new Bot(token);

  registerCommands(bot);
  registerEvent(bot);

  const host = getEnv('host');
  const secretPath = `/grammy/${uuid()}`;

  await bot.api.setWebhook(`${host}${secretPath}`);

  const app = express();
  app.use(json());
  app.use(secretPath, webhookCallback(bot, 'express'));
  app.listen(3000, () => {
    console.log('Webhook Server Started!');
  });
}

handler()
  .then(() => console.log('Bot Running'))
  .catch((error) => {
    console.error('Uncaught Error Thrown', error);
  });
