import { prisma } from '@data/database/prisma';
import { OrganizationRemoveScrumAccountController } from './organization::remove_scrum_account_controller';
import { PrismaOrganizationRemoveScrumRepository } from '@data/database/prisma/repositories/prisma_organization_remove_scrum_repository';
import { OrganizationRemoveScrumAccountUsecase } from '@domain/modules/organization::remove_scrum_account/organization::remove_scrum_account_usecase';

export const organizationRemoveScrumAccountFactory = () => {
  return new OrganizationRemoveScrumAccountController(
    new OrganizationRemoveScrumAccountUsecase(
      new PrismaOrganizationRemoveScrumRepository(prisma),
    ),
  );
};
