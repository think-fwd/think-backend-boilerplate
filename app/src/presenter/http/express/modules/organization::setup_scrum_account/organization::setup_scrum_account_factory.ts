import { JwtUtil } from '@domain/utils/jwt';
import { prisma } from '@data/database/prisma';
import { DateUtil } from '@domain/utils/date';
import { mongoInstance } from '@data/database/mongodb';
import { JiraScrumRepository } from '@data/providers/scrum/jira';
import { OrganizationSetupScrumAccountController } from './organization::setup_scrum_account_controller';
import { PrismaOrganizationUpdateRepository } from '@data/database/prisma/repositories/prisma_organization_update_repository';
import { MongoOrganizationUpdateAccountRepository } from '@data/database/mongodb/repositories/mongo_organization_update_account_repository';
import { OrganizationSetupScrumAccountUsecase } from '@domain/modules/organization::setup_scrum_account/organization::setup_scrum_account_usecase';

export const organizationSetupScrumAccountFactory = () => {
  const dateUtil = new DateUtil();
  const jwtUtil = new JwtUtil();
  const repo = new MongoOrganizationUpdateAccountRepository(mongoInstance);
  return new OrganizationSetupScrumAccountController(
    new OrganizationSetupScrumAccountUsecase(
      new DateUtil(),
      new PrismaOrganizationUpdateRepository(prisma),
      { jira: new JiraScrumRepository(dateUtil, jwtUtil, repo) },
    ),
  );
};
