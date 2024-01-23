import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { UserOrganizationDeleteUsecase } from '@domain/modules/user::organization_delete/user::organization_delete_usecase';

export class UserOrganizationDeleteController implements IEventController {
  constructor(
    private readonly userOrganizationDeleteUsecase: UserOrganizationDeleteUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userOrganizationDeleteUsecase.handle({
        match: { id: req.params.id },
      });
      res.status(200);
      res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
