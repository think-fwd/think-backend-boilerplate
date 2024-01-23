import _ from 'lodash';
import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserResetPasswordUsecase } from '@domain/modules/user::reset_password/user::reset_password_usecase';

export class UserResetPasswordController implements IEventController {
  constructor(
    private readonly userResetPasswordUsecase: UserResetPasswordUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const payload = _.pick(req.body, [
        'code',
        'email',
        'password',
        'password_confirmation',
      ]);
      const response = await this.userResetPasswordUsecase.handle(payload);
      res.status(200);
      res.cookie('Authorization', response.jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.json(response.user);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
