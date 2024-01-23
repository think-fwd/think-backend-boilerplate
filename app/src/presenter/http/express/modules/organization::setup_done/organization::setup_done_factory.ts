import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { OrganizationSetupDoneController } from './organization::setup_done_controller';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';
import { OrganizationSetupDoneUsecase } from '@domain/modules/organization::setup_done/organization::setup_done_usecase';
import { PrismaOrganizationUpdateRepository } from '@data/database/prisma/repositories/prisma_organization_update_repository';

export const organizationSetupDoneFactory = () => {
  return new OrganizationSetupDoneController(
    new OrganizationSetupDoneUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
      new PrismaOrganizationUpdateRepository(prisma),
    ),
  );
};
