import { Request, Response } from 'express';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class AppInfoController implements IEventController {
  async handle(_req: Request, res: Response) {
    res.status(200);
    res.send(`ThinkCrm / ${process.env.APP_VERSION}`);
    return res;
  }
}
