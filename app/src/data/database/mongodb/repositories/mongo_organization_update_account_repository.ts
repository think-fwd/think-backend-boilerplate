import { MongoInstance } from '..';
import { ObjectId } from 'mongodb';
import {
  IOrganizationUpdateAccountRepository,
  OrganizationUpdateAccountRepositoryProps,
} from '@domain/repositories/database/organization_update_account_repository';

export class MongoOrganizationUpdateAccountRepository
  implements IOrganizationUpdateAccountRepository
{
  constructor(private readonly mongoInstance: MongoInstance) {}

  async handle(props: OrganizationUpdateAccountRepositoryProps): Promise<void> {
    try {
      // <!-- initialize mongodb -->
      const database = await this.mongoInstance.connect();
      const collection = await database.collection('organizations');
      collection.updateOne(
        { _id: new ObjectId(props.organization_id) },
        {
          $set: {
            [`${props.kind}.status`]: props.status,
            [`${props.kind}.access_token`]: props.access_token,
            [`${props.kind}.refresh_token`]: props.refresh_token,
          },
        },
      );
    } catch (error) {
      console.log(
        'Error[mongo_organization_update_account_repository]::',
        error.message,
      );
    }
  }
}
