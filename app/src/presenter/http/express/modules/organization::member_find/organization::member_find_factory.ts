import { mongoInstance } from '@data/database/mongodb';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { OrganizationMembersFindUsecase } from '@domain/modules/organization::members_find/organization::members_find_usecase';
import { DateUtil } from '@domain/utils/date';
import { OrganizationMemberFindController } from '@presenter/http/express/modules/organization::member_find/organization::member_find_controller';

export const organizationMembderFindFactory = () => {
  return new OrganizationMemberFindController(
    new OrganizationMembersFindUsecase(
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
    ),
  );
};
