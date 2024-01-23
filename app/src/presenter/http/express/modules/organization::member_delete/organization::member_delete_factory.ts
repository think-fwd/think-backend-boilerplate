import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberDeleteRepository } from '@data/database/prisma/repositories/prisma_member_delete_repository';
import { OrganizationMembersDeleteUsecase } from '@domain/modules/organization::members_delete/organization::members_delete_usecase';
import { OranizationMemberDeleteController } from '@presenter/http/express/modules/organization::member_delete/organization::member_delete_controller';
import { DateUtil } from '@domain/utils/date';

export const organizationMemberDeleteFactory = () => {
  return new OranizationMemberDeleteController(
    new OrganizationMembersDeleteUsecase(
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
      new PrismaMemberDeleteRepository(prisma),
    ),
  );
};
