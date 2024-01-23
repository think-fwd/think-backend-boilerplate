import { Document, ObjectId } from 'mongodb';
import { MongoInstance } from '@data/database/mongodb';
import { MemberEntity } from '@domain/entities/member_entity';
import { PaginationType } from '@domain/utils/pagination/types';
import { PaginationFactory } from '@domain/utils/pagination/factory';

import {
  IMemberFindRepository,
  MemberFindRepositoryProps,
} from '@domain/repositories/database/member_find_repository';
import { DateUtil } from '@domain/utils/date';

export class MongoMemberFindRepository implements IMemberFindRepository {
  constructor(
    private readonly dateUtil: DateUtil,
    private readonly mongoInstance: MongoInstance,
  ) {}

  async handle(
    props: MemberFindRepositoryProps,
  ): Promise<PaginationType<MemberEntity> | MemberEntity[]> {
    // <!-- initialize mongodb -->
    const database = await this.mongoInstance.connect();
    const collection = await database.collection('members');
    // <!-- initialize pagination factory -->
    const paginationFactory = new PaginationFactory<MemberEntity>({
      ...props,
      allowedFields: props.allowedFields || [
        'id',
        'email',
        'code',
        'role',
        'status',
        'user_id',
        'user_name',
        'blocked',
        'organization_id',
        'organization',
        'created_at',
        'updated_at',
      ],
    });

    const match: Document = {};

    // match by id
    if (props.match?.id) {
      match['_id'] = { $eq: new ObjectId(props.match.id) };
    }

    // match by email
    if (props.match?.email) {
      match['email'] = { $eq: props.match.email };
    }

    // match by code
    if (props.match?.mail_attempt_code) {
      match['mail_attempt_code'] = { $eq: props.match.mail_attempt_code };
    }

    // match by organization id
    if (props.match?.organization_id) {
      match['organization_id'] = {
        $eq: new ObjectId(props.match.organization_id),
      };
    }

    // match by user id
    if (props.match?.user_id) {
      match['user_id'] = { $eq: props.match.user_id };
    }

    // determine pipeline array
    const pipeline: Document[] = [{ $match: match }];

    // filters
    const filters: Document = {};
    if (props.filter?.q) {
      filters['$or'] = [{ email: { $regex: props.filter?.q, $options: 'i' } }];
    }
    if (props.filter?.role) {
      filters['role'] = { $in: props.filter.role.split(',') };
    }
    if (props.filter?.status) {
      filters['status'] = { $in: props.filter.status.split(',') };
    }
    if (props.filter?.created_at) {
      filters['created_at'] = {
        $gte: this.dateUtil
          .normalize(props.filter.created_at)
          .startOf('day')
          .toDate(),
        $lte: this.dateUtil
          .normalize(props.filter.created_at)
          .endOf('day')
          .toDate(),
      };
    }

    // append filters
    if (Object.keys(filters).length > 0) pipeline.push({ $match: filters });

    pipeline.push({
      $lookup: {
        from: 'organizations',
        localField: 'organization_id',
        foreignField: '_id',
        as: 'organizations',
      },
    });
    pipeline.push({
      $addFields: {
        organization: {
          id: { $first: '$organizations._id' },
          name: { $first: '$organizations.name' },
          status: { $first: '$organizations.status' },
        },
      },
    });

    // <!-- return results -->
    return await paginationFactory.execute(collection, pipeline);
  }
}
