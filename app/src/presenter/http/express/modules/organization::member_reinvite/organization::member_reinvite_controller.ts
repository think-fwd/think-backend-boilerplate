import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { OrganizationMembersReinviteUsecase } from '@domain/modules/organization::members_reinvite/organization::members_reinvite_usecase';

export class OrganizationMemberReinviteController implements IEventController {
  constructor(
    private readonly organizationMembersReinviteUsecase: OrganizationMembersReinviteUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.organizationMembersReinviteUsecase.handle({
        match: {
          id: req.params.id,
          organization_id: req.params.organization_id,
        },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
