import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserActivationUsecase } from '@domain/modules/user::activation/user::activation_usecase';

export class UserActivationController implements IEventController {
  constructor(private readonly userActivationUsecase: UserActivationUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      await this.userActivationUsecase.handle({
        email: req.body.email,
        code: req.body.code,
      });
      res.status(200);
      res.json({ status: 'ok' });
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
