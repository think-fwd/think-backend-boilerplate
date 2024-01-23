// import settings
import 'dotenv/config';
import { config } from '@config';

// import lib dependencies
import cors from 'cors';
import express from 'express';
import { json } from 'body-parser';
import { routes } from './routes';
import cookieParser from 'cookie-parser';

// initialize and configure application middlewares
const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    optionSuccessStatus: 200,
    origin: (origin, callback) => {
      const isProduction = process.env.NODE_ENV === 'production';
      const allowOrigins = [
        'http://localhost:3000',
        `https://${process.env.FRONTEND_URL!}`,
      ];
      // production and only accepts prod frontend requests
      if (isProduction && origin === `https://${process.env.FRONTEND_URL!}`) {
        return callback(null, true);
      }
      // not production and using rest tools
      if (!isProduction && !origin) {
        return callback(null, true);
      }
      // not production and accepting localhost app requests
      if (!isProduction && allowOrigins.includes(origin)) {
        return callback(null, true);
      }
      // throw anything else
      return callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(json(config.express.json));
app.use(routes);

// export application
export { app };
