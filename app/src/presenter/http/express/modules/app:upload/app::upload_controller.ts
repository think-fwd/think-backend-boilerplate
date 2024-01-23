import { Request, Response } from 'express';
import { handleError } from '../../utils/handle_error';
import { IEventController } from '../../interfaces/event_controller_interface';
import { SystemUploadPresignUsecase } from '@domain/modules/system::upload_presign/system::upload_presign_usecase';

export class AppUploadController implements IEventController {
  constructor(
    private readonly systemUploadPresignUsecase: SystemUploadPresignUsecase,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const response = await this.systemUploadPresignUsecase.handle({
        extension: req.body.extension as unknown as string,
      });
      res.status(200);
      res.json(response);
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  }
}
