import { Request, Response } from 'express';
import { DateUtil } from '@domain/utils/date';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class AppLocationsController implements IEventController {
  constructor(private readonly dateUtil: DateUtil) {}

  async handle(req: Request, res: Response) {
    res.status(200);
    res.send(this.dateUtil.names());
    return res;
  }
}
