import { MongoInstance } from '..';
import { Document, ObjectId } from 'mongodb';
import { PaginationType } from '@domain/utils/pagination/types';
import { PaginationFactory } from '@domain/utils/pagination/factory';
import { OrganizationEntity } from '@domain/entities/organization_entity';

import {
  OrganizationFindRepositoryProps,
  IOrganizationFindRepository,
} from '@domain/repositories/database/organization_find_repository';

export class MongoOrganizationFindRepository
  implements IOrganizationFindRepository
{
  constructor(private readonly mongoInstance: MongoInstance) {}

  async handle(
    props: OrganizationFindRepositoryProps,
  ): Promise<PaginationType<OrganizationEntity> | OrganizationEntity[]> {
    try {
      // <!-- initialize mongodb -->
      const database = await this.mongoInstance.connect();
      const collection = await database.collection('organizations');
      // <!-- initialize pagination factory -->
      const paginationFactory = new PaginationFactory<OrganizationEntity>({
        ...props,
        allowedFields: props.allowedFields,
      });

      const match: Document = {};

      // filter by id
      if (props.match?.id instanceof Array) {
        match['_id'] = { $in: props.match.id.map(id => new ObjectId(id)) };
      } else if (typeof props.match?.id === 'string') {
        match['_id'] = { $eq: new ObjectId(props.match.id) };
      }

      // determine pipeline array
      const pipeline: Document[] = [{ $match: match }];

      // filter by user member if provided
      if (props.match?.user_id) {
        pipeline.push({
          $lookup: {
            from: 'members',
            localField: 'id',
            foreignField: 'organization_id',
            as: 'members',
          },
        });
        pipeline.push({ $match: { user_id: { $eq: props.match.user_id } } });
      }

      // <!-- execute pipeline -->
      const results = await paginationFactory.execute(collection, pipeline);

      // <!-- return results -->
      return results;
    } catch (error) {
      console.log(
        'Error[mongo_organizations_find_repository]::',
        error.message,
      );
      return [];
    }
  }
}
