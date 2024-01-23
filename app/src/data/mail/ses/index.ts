import fs from 'fs';
import path from 'path';
import { AWSProvider } from '@data/aws';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {
  IEmailRepository,
  EmailProps,
} from '@domain/repositories/mail/email_send_repository';

class SESProvider extends AWSProvider implements IEmailRepository {
  client: SESClient;

  constructor() {
    super();
    this.client = new SESClient(this.buildConfig());
  }

  async send(props: EmailProps): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const htmlBuffer = await fs.readFileSync(
        path.join(
          __dirname + `/../../../domain/assets/emails/${props.templateId}.html`,
        ),
      );
      let htmlTemplate = htmlBuffer.toString();
      if (typeof htmlTemplate !== 'string')
        throw new Error('template not founded');
      for (const field in props.dynamicTemplateData || {}) {
        htmlTemplate = htmlTemplate.replace(
          `{{${field}}}`,
          String(props.dynamicTemplateData?.[field]),
        );
      }
      await this.client.send(
        new SendEmailCommand({
          Destination: {
            CcAddresses: [],
            ToAddresses: [props.to],
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: htmlTemplate,
              },
              Text: {
                Charset: 'UTF-8',
                Data: htmlTemplate,
              },
            },
            Subject: {
              Charset: 'UTF-8',
              Data: props.subject,
            },
          },
          Source: `ThinkCrm <${props.from}>`,
          ReplyToAddresses: [],
        }),
      );
      return true;
    } catch (e) {
      console.error('Failed to send email.', e.message);
      return false;
    }
  }
}

export { SESProvider };
