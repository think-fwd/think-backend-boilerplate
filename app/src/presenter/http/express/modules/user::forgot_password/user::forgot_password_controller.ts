import _ from 'lodash';
import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserForgotPasswordUsecase } from '@domain/modules/user::forgot_password/user::forgot_password_usecase';

export class UserForgotPasswordController implements IEventController {
  constructor(
    private readonly userForgotPasswordUsecase: UserForgotPasswordUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const payload = _.pick(req.body, ['email']);
      const response = await this.userForgotPasswordUsecase.handle(payload);
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
