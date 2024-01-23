import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { ScrumProviderEnum } from '@domain/enums/scrum_provider_enum';
import { IEventController } from '../../interfaces/event_controller_interface';
import { OrganizationSetupScrumAccountUsecase } from '@domain/modules/organization::setup_scrum_account/organization::setup_scrum_account_usecase';

export class OrganizationSetupScrumAccountController
  implements IEventController
{
  constructor(
    private readonly organizationSetupScrumAccountUsecase: OrganizationSetupScrumAccountUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.organizationSetupScrumAccountUsecase.handle({
        organizationId: req.params.id as unknown as string,
        provider: req.body.provider as unknown as ScrumProviderEnum,
        code: req.body.code as unknown as string,
      });
      await res.status(200);
      return res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
