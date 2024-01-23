import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { UserOrganizationInsertUsecase } from '@domain/modules/user::organization_insert/user::organization_insert_usecase';

export class UserOrganizationInsertController implements IEventController {
  constructor(
    private readonly userOrganizationInsertUsecase: UserOrganizationInsertUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userOrganizationInsertUsecase.handle({
        user: req.user,
        data: {
          name: req.body?.name as unknown as string,
          document: req.body?.document as unknown as string,
        },
      });
      res.status(200);
      res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
