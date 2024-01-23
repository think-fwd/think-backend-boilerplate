import '../../../alias';
import 'dotenv/config';
import _ from 'lodash';
import { SQSEvent } from 'aws-lambda';
import { SESProvider } from '@data/mail/ses';
import { MemberEntity } from '@domain/entities/member_entity';

export const handle = async (event: SQSEvent) => {
  try {
    console.log('[Submit-Member-Invite]=', event);
    const messageBody = JSON.parse(event.Records?.[0]?.body || '{}');
    const member = _.get(messageBody, 'detail.fullDocument') as MemberEntity;

    // send email
    const emailProvider = new SESProvider();
    await emailProvider.send({
      to: member.email,
      from: 'ro-reply@thinkforward.com.br',
      subject: 'Convite para participar do Think CRM',
      templateId: 'invite-member',
      dynamicTemplateData: {
        invite_url: `${process.env.FRONTEND_URL!}/invite?code=${
          member.mail_attempt_code
        }&email=${member.email}`,
      },
    });

    // return 200 if usecase does not throws
    console.log('Email enviado para', member.email);
    return { statusCode: 200 };
  } catch (error) {
    console.log(error.message);
    return { statusCode: 400, body: error.message };
  }
};
