import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserSessionUsecase } from '@domain/modules/user:session/user::session_usecase';

export class UserSessionController implements IEventController {
  constructor(private readonly userSessionUsecase: UserSessionUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userSessionUsecase.handle({ user: req.user });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
