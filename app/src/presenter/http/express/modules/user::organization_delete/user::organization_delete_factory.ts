import { prisma } from '@data/database/prisma';
import { UserOrganizationDeleteController } from './user::organization_delete_controller';
import { UserOrganizationDeleteUsecase } from '@domain/modules/user::organization_delete/user::organization_delete_usecase';
import { PrismaOrganizationDeleteRepository } from '@data/database/prisma/repositories/prisma_organization_delete_repository';

export const userOrganizationDeleteFactory = () => {
  return new UserOrganizationDeleteController(
    new UserOrganizationDeleteUsecase(
      new PrismaOrganizationDeleteRepository(prisma),
    ),
  );
};
