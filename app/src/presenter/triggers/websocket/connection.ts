import '../../../alias';
import _ from 'lodash';
import { AuthType } from '@domain/types/auth_type';

export const handle = async (event, context) => {
  try {
    console.log('Event->', event);
    console.log('Context->', context);

    // extract needed info from event
    const routeKey = _.get(event, 'requestContext.routeKey');
    const connectionId = _.get(event, 'requestContext.connectionId');
    const auth = JSON.parse(
      _.get(event, 'requestContext.authorizer.auth'),
    ) as AuthType;

    // throws an error if rout is not for connection
    if (routeKey !== '$connect') throw new Error('route not implemented');

    // execute usecase
    console.log(
      `attaching connectionId=${connectionId} to user=${auth.sub} thought memcached...`,
    );

    // return 200 if usecase does not throws
    console.log('Conexão estabelecida');
    return { statusCode: 200 };
  } catch (error) {
    console.log(error.message);
    return { statusCode: 400, body: error.message };
  }
};
