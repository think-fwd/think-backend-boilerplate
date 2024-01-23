import { Request, Response } from 'express';
import { DateUtil } from '@domain/utils/date';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';

export class AppDatesController implements IEventController {
  constructor(private readonly dateUtil: DateUtil) {}

  async handle(_req: Request, res: Response) {
    res.status(200);
    res.send(`
        <h1>${this.dateUtil.info()}</h1>
        <table>
          <tr>
          <td style="font-weight: bold; text-align:right;">Moment</td>
          <td>&nbsp; - &nbsp;</td>
          <td>${this.dateUtil.normalize()}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; text-align:right;">Moment - Start Day</td>
          <td>&nbsp; - &nbsp;</td>
          <td>${this.dateUtil.normalize().startOf('day')}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; text-align:right;">Moment - Formatted</td>
          <td>&nbsp; - &nbsp;</td>
          <td>${this.dateUtil.normalize().format('YYYY-MM-DD HH:mm:ss')}</td>
        </tr>
      </table>
    `);
    return res;
  }
}
