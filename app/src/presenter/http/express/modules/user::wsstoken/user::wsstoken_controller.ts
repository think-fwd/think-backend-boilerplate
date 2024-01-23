import { Request, Response } from 'express';
import { JwtUtil } from '@domain/utils/jwt';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class UserWssTokenController implements IEventController {
  constructor(private readonly jwtUtil: JwtUtil) {}

  async handle(req: Request, res: Response) {
    try {
      const token = await this.jwtUtil.sign(
        req.user.sub,
        req.user.email,
        'thinkcrm::wss::notifications',
        { expireInDays: 30, payload: { name: req.user.name } },
      );
      res.status(200);
      res.json({ jwt: token });
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
