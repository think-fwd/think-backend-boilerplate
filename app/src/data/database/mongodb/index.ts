import { MongoClient, Db } from 'mongodb';
class MongoInstance {
  database: Db;

  constructor(private readonly client: MongoClient) {}

  getDatabase = (): Db | undefined => {
    return this.database;
  };

  connect = async (): Promise<Db> => {
    // try to load cache database
    const cachedDatabase = this.getDatabase();
    // return database instance if it is already loaded
    if (cachedDatabase) return cachedDatabase;
    // create a new database instance if it is not defined
    await this.client.connect();
    this.database = this.client.db();
    return this.database;
  };
}

const mongoClient = new MongoClient(
  process.env.DATABASE_URI! || 'mongodb+srv://host',
);

const mongoInstance = new MongoInstance(mongoClient);
export { MongoInstance, mongoInstance };
