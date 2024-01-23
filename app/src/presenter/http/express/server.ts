// start app imports
import '../../../alias';
import serverless from 'serverless-http';
import { app } from './app';
const handler = serverless(app, { provider: 'aws' });
export const handle = async (context, req) => {
  context.res = await handler(context, req);
  return context.res;
};
