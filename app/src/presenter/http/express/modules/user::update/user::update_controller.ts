import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { UserUpdateUsecase } from '@domain/modules/user:update/user::update_usecase';

export class UserUpdateController implements IEventController {
  constructor(private readonly userUpdateUsecase: UserUpdateUsecase) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userUpdateUsecase.handle({
        token: req.jwt,
        sub: req.auth.sub as unknown as string,
        name: req.body?.name as unknown as string,
        picture: req.body?.picture as unknown as string,
      });
      res.status(200);
      res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
