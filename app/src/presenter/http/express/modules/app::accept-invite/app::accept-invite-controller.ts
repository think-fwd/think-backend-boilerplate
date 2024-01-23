import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserMemberHandleInviteUsecase } from '@domain/modules/user::member_handle_invite/user::member_handle_invite_usecase';

export class AppAcceptInviteController implements IEventController {
  constructor(
    private readonly userMemberHandleInviteUsecase: UserMemberHandleInviteUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userMemberHandleInviteUsecase.handle({
        match: { email: req.body.email, mail_attempt_code: req.body.code },
        data: { action: 'accept' },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
