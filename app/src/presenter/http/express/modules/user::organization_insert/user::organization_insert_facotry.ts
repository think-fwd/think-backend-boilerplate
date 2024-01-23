import { prisma } from '@data/database/prisma';
import { UserOrganizationInsertController } from './user::organization_insert_controller';
import { PrismaOrganizationInsertRepository } from '@data/database/prisma/repositories/prisma_organization_insert_repository';
import { UserOrganizationInsertUsecase } from '@domain/modules/user::organization_insert/user::organization_insert_usecase';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';
import { mongoInstance } from '@data/database/mongodb';

export const userOrganizationInsertFactory = () => {
  return new UserOrganizationInsertController(
    new UserOrganizationInsertUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
      new PrismaOrganizationInsertRepository(prisma),
    ),
  );
};
