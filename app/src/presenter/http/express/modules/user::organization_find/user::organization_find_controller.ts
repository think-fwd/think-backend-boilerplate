import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { UserOrganizationFindUsecase } from '@domain/modules/user::organization_find/user::organization_find_usecase';

export class UserOrganizationFindController implements IEventController {
  constructor(
    private readonly userOrganizationFindUsecase: UserOrganizationFindUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userOrganizationFindUsecase.handle({
        limit: req.query.limit as unknown as string,
        page: req.query.page as unknown as string,
        match: { user_id: req.user.sub },
      });
      res.status(200);
      res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
