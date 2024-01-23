import { Request, Response } from 'express';

export interface IEventController {
  handle(request: Request, response: Response);
}
