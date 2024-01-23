import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { OrganizationMembersDeleteUsecase } from '@domain/modules/organization::members_delete/organization::members_delete_usecase';

export class OranizationMemberDeleteController implements IEventController {
  constructor(
    private readonly organizationMemberDeleteUsecase: OrganizationMembersDeleteUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { organization_id, id } = req.params;
      const response = await this.organizationMemberDeleteUsecase.handle({
        user: req.user,
        match: { organization_id: organization_id, id: id },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
