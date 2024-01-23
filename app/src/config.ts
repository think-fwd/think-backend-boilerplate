import { join } from 'path';
const root = join(__dirname, './');
const MAX_MB_FILE_SIZE = 20;
export const config = {
  port: process.env.PORT || 1337,
  dir: {
    root,
  },
  constants: {
    ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
  database: {
    uri: process.env.DATABASE_URI!,
  },
  express: {
    json: {
      limit: `${MAX_MB_FILE_SIZE}MB`,
    },
  },
};
