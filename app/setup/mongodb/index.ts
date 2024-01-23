import { config } from 'dotenv';
import { MongodbSetup } from './handle';
config();

(async () => {
  const setup = new MongodbSetup();
  await setup.handle();
})();
