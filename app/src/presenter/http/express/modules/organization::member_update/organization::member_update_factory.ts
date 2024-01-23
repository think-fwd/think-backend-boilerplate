import { DateUtil } from '@domain/utils/date';
import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { OrganizationMemberUpdateController } from './organization::member_update_controller';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberUpdateRepository } from '@data/database/prisma/repositories/prisma_member_update_repository';
import { OrganizationMembersUpdateUsecase } from '@domain/modules/organization::members_update/organization::members_update_usecase';

export const organizationMemberUpdateFactory = () => {
  return new OrganizationMemberUpdateController(
    new OrganizationMembersUpdateUsecase(
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
      new PrismaMemberUpdateRepository(prisma),
    ),
  );
};
