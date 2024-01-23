import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { RepositoryProviderEnum } from '@domain/enums/repository_provider_enum';
import { OrganizationSetupRepositoryAccountUsecase } from '@domain/modules/organization::setup_repository_account/organization::setup_repository_account_usecase';

export class OrganizationSetupRepositoryAccountController
  implements IEventController
{
  constructor(
    private readonly organizationSetupRepositoryAccountUsecase: OrganizationSetupRepositoryAccountUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response =
        await this.organizationSetupRepositoryAccountUsecase.handle({
          organizationId: req.params.id as unknown as string,
          provider: req.body.provider as unknown as RepositoryProviderEnum,
          code: req.body.code as unknown as string,
        });
      await res.status(200);
      return res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
