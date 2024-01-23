import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { UserOrganizationUpdateUsecase } from '@domain/modules/user::organization_update/user::organization_update_usecase';

export class UserOrganizationUpdateController implements IEventController {
  constructor(
    private readonly userOrganizationUpdateUsecase: UserOrganizationUpdateUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.userOrganizationUpdateUsecase.handle({
        match: { id: req.params.id },
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
