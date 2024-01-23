import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserOrganizationDetailsUsecase } from '@domain/modules/user::organization_details/user::organization_details_usecase';

export class UserOrganizationDetailsController implements IEventController {
  constructor(
    private readonly organizationDetailsUsecase: UserOrganizationDetailsUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.organizationDetailsUsecase.handle({
        match: { organization_id: req.params.id },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
