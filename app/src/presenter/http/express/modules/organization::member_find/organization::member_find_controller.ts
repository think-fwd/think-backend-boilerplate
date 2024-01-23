import { Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { OrganizationMembersFindUsecase } from '@domain/modules/organization::members_find/organization::members_find_usecase';
import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import { MemberStatusEnum } from '@domain/enums/member_status_enum';

export class OrganizationMemberFindController implements IEventController {
  constructor(
    private readonly organizationMemberFindUsecase: OrganizationMembersFindUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { organization_id } = req.params;
      const response = await this.organizationMemberFindUsecase.handle({
        limit: req.query.limit as string,
        page: req.query.page as string,
        match: { organization_id },
        filter: {
          q: req.query.q as string,
          role: req.query.role as MemberRoleEnum,
          status: req.query.status as MemberStatusEnum,
          created_at: req.query.created_at as string,
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
