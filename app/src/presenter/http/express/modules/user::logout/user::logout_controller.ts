import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class UserLogoutController implements IEventController {
  async handle(req: Request, res: Response) {
    try {
      res.status(200);
      res.clearCookie('Authorization', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.send('Disconnected');
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
