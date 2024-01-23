import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { OrganizationMembersUpdateUsecase } from '@domain/modules/organization::members_update/organization::members_update_usecase';

export class OrganizationMemberUpdateController implements IEventController {
  constructor(
    private readonly organizationMemberUpdateUsecase: OrganizationMembersUpdateUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { role, blocked } = req.body;
      const { organization_id, id } = req.params;
      const response = await this.organizationMemberUpdateUsecase.handle({
        match: { organization_id: organization_id, id: id },
        data: { role, blocked },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
