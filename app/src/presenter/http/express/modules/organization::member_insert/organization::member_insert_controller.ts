import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { OrganizationMembersInsertUsecase } from '@domain/modules/organization::members_insert/organization::members_insert_usecase';

export class OrganizationMemberInsertController implements IEventController {
  constructor(
    private readonly organizationMemberInsertUsecase: OrganizationMembersInsertUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { email, role } = req.body;
      const { organization_id } = req.params;
      const response = await this.organizationMemberInsertUsecase.handle({
        data: { organization_id, email, role },
      });
      res.status(200);
      res.json(response);
      return res;
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
