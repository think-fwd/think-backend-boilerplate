import 'dotenv/config';
import '../src/alias';

// ################################################ //
// ### RUN APPLICATION SEND NOTIFICATION ########## //
// ################################################ //
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { handle } from '../src/presenter/triggers/mongodb/member-created';

export const handler = async () => {
  try {
    await handle({
      Records: [
        {
          body: JSON.stringify({
            detail: {
              fullDocument: {
                id: '',
                role: '',
                status: '',
                user_id: '',
                organization_id: '',
                invite_code: '123456',
                invite_email: 'andre.ciornavei@gmail.com',
              },
            },
          }),
        },
      ],
    } as unknown as SQSEvent);
    return { statusCode: 200 };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
