import { mongoInstance } from '@data/database/mongodb';
import { UserOrganizationFindController } from './user::organization_find_controller';
import { UserOrganizationFindUsecase } from '@domain/modules/user::organization_find/user::organization_find_usecase';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';

export const userOrganizationFindFactory = () => {
  return new UserOrganizationFindController(
    new UserOrganizationFindUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
    ),
  );
};
