import { Db, IndexDescription } from 'mongodb';

export const handle = async (database: Db): Promise<boolean> => {
  const index: IndexDescription[] = [];
  const coll_name = 'members';

  // check if migrations collection
  // exists and creat it if does not exists
  const stmt = database.listCollections();
  const collections = await stmt.toArray();
  const migrations = collections.find(c => c.name === coll_name);
  if (!migrations) {
    console.log(`creating database ${coll_name} collection...`);
    await database.createCollection(coll_name);
  } else {
    console.log(`database ${coll_name} collection already exists.`);
  }

  const collection = database.collection(coll_name);

  if (!(await collection.indexExists('unique_organization_member_email'))) {
    index.push({
      unique: true,
      key: { email: 1, organization_id: 1 },
      name: 'unique_organization_member_email',
    });
  }

  if (index.length > 0) {
    await collection.createIndexes(index);
    console.log(`- ${coll_name} indexes applied successfully`);
  } else {
    console.log(`- no ${coll_name} indexes to apply`);
  }

  // return if migration should be registered on database
  return false;
};
