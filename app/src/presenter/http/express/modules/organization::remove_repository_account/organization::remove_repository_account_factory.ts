import { prisma } from '@data/database/prisma';
import { OrganizationRemoveRepositoryAccountController } from './organization::remove_repository_account_controller';
import { PrismaOrganizationRemoveRepositoryRepository } from '@data/database/prisma/repositories/prisma_organization_remove_repository_repository';
import { OrganizationRemoveRepositoryAccountUsecase } from '@domain/modules/organization::remove_repository_account/organization::remove_repository_account_usecase';

export const organizationRemoveRepositoryAccountFactory = () => {
  return new OrganizationRemoveRepositoryAccountController(
    new OrganizationRemoveRepositoryAccountUsecase(
      new PrismaOrganizationRemoveRepositoryRepository(prisma),
    ),
  );
};
