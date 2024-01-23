import '../../../alias';
import { JwtUtil } from '@domain/utils/jwt';
import { AuthType } from '@domain/types/auth_type';

export const handle = async (event, context, callback): Promise<void> => {
  try {
    const jwtUtil = new JwtUtil();
    const authToken = event.queryStringParameters.Auth;
    const contextPayload = jwtUtil.verify(
      authToken,
      process.env.WSS_TOKEN_SECRET!,
    ) as AuthType;

    // allow request
    callback(null, {
      principalId: 'user',
      context: { auth: JSON.stringify(contextPayload) },
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
    });
  } catch (error) {
    // deny request
    callback(null, {
      principalId: 'user',
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: event.methodArn,
        },
      ],
    });
  }
};
