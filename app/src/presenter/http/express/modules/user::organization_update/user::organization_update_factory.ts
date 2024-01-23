import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { UserOrganizationUpdateController } from './user::organization_update_controller';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';
import { UserOrganizationUpdateUsecase } from '@domain/modules/user::organization_update/user::organization_update_usecase';
import { PrismaOrganizationUpdateRepository } from '@data/database/prisma/repositories/prisma_organization_update_repository';

export const userOrganizationUpdateFactory = () => {
  return new UserOrganizationUpdateController(
    new UserOrganizationUpdateUsecase(
      new PrismaOrganizationUpdateRepository(prisma),
      new MongoOrganizationFindRepository(mongoInstance),
    ),
  );
};
