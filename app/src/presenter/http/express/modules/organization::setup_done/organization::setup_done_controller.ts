import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { OrganizationSetupDoneUsecase } from '@domain/modules/organization::setup_done/organization::setup_done_usecase';

export class OrganizationSetupDoneController implements IEventController {
  constructor(
    private readonly organizationSetupDoneUsecase: OrganizationSetupDoneUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.organizationSetupDoneUsecase.handle({
        organizationId: req.params.id as unknown as string,
      });
      await res.status(200);
      return res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
