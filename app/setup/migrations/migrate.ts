import fs from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

export const migrate = async (single_migration?: string | undefined) => {
  // #1 - load environment variables
  console.log('loading environment variables...');
  config();

  // #2 - connect client to mongodb
  console.log('initializing mongodb client...');
  const mongoClient = new MongoClient(process.env.MONGODB_URI!);
  const client = await mongoClient.connect();
  const database = client.db();

  // #3 - check if migrations collection
  // exists and creat it if does not exists
  const stmt = database.listCollections();
  const collections = await stmt.toArray();
  const migrations = collections.find(c => c.name === 'migrations');
  if (!migrations) {
    console.log('creating database migrations collection...');
    await database.createCollection('migrations');
  } else {
    console.log('database migrations collection already exists.');
  }

  // #4 - list all processed migrations
  const collection = database.collection('migrations');
  const processed_migrations = await collection.find().toArray();
  const ref_migrations = new Set(processed_migrations.map(i => i.migration));

  // #5 - run all migration scripts
  console.log('running migrations...');
  const scripts = fs.readdirSync(resolve(__dirname, 'scripts'));
  for (const script of scripts) {
    // do not process migration if single_migration
    // is defined and is not the current entry script
    if (single_migration && !script.endsWith(single_migration)) continue;

    // do not process migration if it was already
    // processed before and registered on database
    // * ONLY IF NOT A SINGLE MIGRATION (FOR DEV PURPOSES)
    if (!single_migration && ref_migrations.has(script)) continue;

    // run script
    console.log('run', script);
    const { handle } = await import(
      resolve(__dirname, 'scripts', script, 'index.ts')
    );
    // execute script and get response boolean to register or not on database
    const shouldRegisterOnDatabase = await handle(database, script);

    // register migration process on database
    // to avoid re-process on next migration run
    // * ONLY IF NOT A SINGLE MIGRATION (FOR DEV PURPOSES)
    if (!single_migration && shouldRegisterOnDatabase) {
      console.log('registering migration process...');
      await collection.insertOne({ migration: script, createdAt: new Date() });
    }
  }

  // #6 - close connection
  console.log('closing db connection...');
  client.close();

  // #7 - exit
  console.log('done...');
  process.exit(0);
};
