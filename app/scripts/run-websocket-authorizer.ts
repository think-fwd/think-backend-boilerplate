import 'dotenv/config';
import '../src/alias';

import { handle } from '../src/presenter/triggers/websocket/authorizer';

export const handler = async () => {
  try {
    await handle(
      {
        queryStringParameters: {
          Auth: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDkwZWUwMy1kZjE1LTQ4OTktOTJhMi04MzI2ZTVlYmNiNTgiLCJlbWFpbCI6ImFuZHJlQHRoaW5rZm9yd2FyZC5jb20uYnIiLCJhdWQiOiJ0aGlua2NybTo6d3NzOjpub3RpZmljYXRpb25zIiwiZXhwIjoxNzA4Mjg0MTE2LCJkYXRhIjp7Im5hbWUiOiJBbmRyw6kgQ2lvcm5hdmVpIn0sImlhdCI6MTcwNTY5MjExNn0.E8lLIq-W0m2W6F4LKvs-BG53tpt7IZvNgKCfhGC8l7I',
        },
      },
      {},
      (_, payload) => console.log('done', payload),
    );
    return { statusCode: 200 };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
