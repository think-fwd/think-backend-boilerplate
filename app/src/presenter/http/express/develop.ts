import 'dotenv/config';
import * as HTTPServer from 'http';
import { app } from './app';

// create http-server
const server = HTTPServer.createServer(app);
server.listen(process.env.PORT || 1337);
server.on('listening', () => {
  console.log(`NODE_ENV=${process.env.NODE_ENV}`);
  console.log(`http server is running on port ${process.env.PORT || 1337}`);
});
