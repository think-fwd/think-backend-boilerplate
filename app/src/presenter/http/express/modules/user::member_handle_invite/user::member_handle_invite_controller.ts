import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserMemberHandleInviteUsecase } from '@domain/modules/user::member_handle_invite/user::member_handle_invite_usecase';

export class UserMemberHandleInviteController implements IEventController {
  constructor(
    private readonly userMemberHandleInviteUsecase: UserMemberHandleInviteUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { email } = req.user;
      const response = await this.userMemberHandleInviteUsecase.handle({
        match: { email: email, mail_attempt_code: req.params.code },
        data: { action: req.params.action as 'accept' | 'decline' },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
