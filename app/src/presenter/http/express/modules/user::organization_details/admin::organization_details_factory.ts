import { mongoInstance } from '@data/database/mongodb';
import { UserOrganizationDetailsController } from './admin::organization_details_controller';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';
import { UserOrganizationDetailsUsecase } from '@domain/modules/user::organization_details/user::organization_details_usecase';

export const userOrganizationDetailsFactory = () => {
  return new UserOrganizationDetailsController(
    new UserOrganizationDetailsUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
    ),
  );
};
