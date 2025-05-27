import { bootstrap } from '../src/main';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Request, Response } from 'express';

let cachedApp: ExpressAdapter | null = null;

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    const app = await bootstrap();
    cachedApp = app.getHttpAdapter() as ExpressAdapter;
  }

  return cachedApp.getInstance()(req, res);
}
