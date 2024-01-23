import _ from 'lodash';
import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserRegistrationUsecase } from '@domain/modules/user::registration/user::registration_usecase';

export class UserRegistrationController implements IEventController {
  constructor(
    private readonly userRegistrationUsecase: UserRegistrationUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const payload = _.pick(req.body, [
        'email',
        'password',
        'name',
        'phone_number',
      ]);
      const response = await this.userRegistrationUsecase.handle(payload);
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
