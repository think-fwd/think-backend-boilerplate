import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { OrganizationRepositoryStatusUsecase } from '@domain/modules/organization::repository_status/organization::repository_status_usecase';

export class OrganizationRepositoryStatusController
  implements IEventController
{
  constructor(
    private readonly organizationRepositoryStatusUsecase: OrganizationRepositoryStatusUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.organizationRepositoryStatusUsecase.handle({
        organizationId: req.params.id as unknown as string,
      });
      await res.status(200);
      return res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
