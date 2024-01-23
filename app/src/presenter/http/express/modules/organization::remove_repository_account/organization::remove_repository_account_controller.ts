import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { OrganizationRemoveRepositoryAccountUsecase } from '@domain/modules/organization::remove_repository_account/organization::remove_repository_account_usecase';

export class OrganizationRemoveRepositoryAccountController
  implements IEventController
{
  constructor(
    private readonly organizationRemoveRepositoryAccountUsecase: OrganizationRemoveRepositoryAccountUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response =
        await this.organizationRemoveRepositoryAccountUsecase.handle({
          organizationId: req.params.id as unknown as string,
        });
      await res.status(200);
      return res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
