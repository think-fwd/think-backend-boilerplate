import _ from 'lodash';
import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { UserLoginUsecase } from '@domain/modules/user::login/user::login_usecase';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class UserLoginController implements IEventController {
  constructor(private readonly userLoginUsecase: UserLoginUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const payload = _.pick(req.body, ['email', 'password']);
      const response = await this.userLoginUsecase.handle(payload);
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
