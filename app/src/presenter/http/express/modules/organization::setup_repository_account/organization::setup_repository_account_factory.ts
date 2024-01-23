import { prisma } from '@data/database/prisma';
import { DateUtil } from '@domain/utils/date';
import { mongoInstance } from '@data/database/mongodb';
import { GitlabRepositoryProvider } from '@data/providers/repository/gitlab';
import { BitbucketRepositoryProvider } from '@data/providers/repository/bitbucket';
import { OrganizationSetupRepositoryAccountController } from './organization::setup_repository_account_controller';
import { PrismaOrganizationUpdateRepository } from '@data/database/prisma/repositories/prisma_organization_update_repository';
import { MongoOrganizationUpdateAccountRepository } from '@data/database/mongodb/repositories/mongo_organization_update_account_repository';
import { OrganizationSetupRepositoryAccountUsecase } from '@domain/modules/organization::setup_repository_account/organization::setup_repository_account_usecase';
import { GithubRepositoryProvider } from '@data/providers/repository/github';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';

export const organizationSetupRepositoryAccountFactory = () => {
  const dateUtil = new DateUtil();
  const repo = new MongoOrganizationUpdateAccountRepository(mongoInstance);
  return new OrganizationSetupRepositoryAccountController(
    new OrganizationSetupRepositoryAccountUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
      new PrismaOrganizationUpdateRepository(prisma),
      {
        bitbucket: new BitbucketRepositoryProvider(dateUtil, repo),
        gitlab: new GitlabRepositoryProvider(dateUtil, repo),
        github: new GithubRepositoryProvider(dateUtil, repo),
      },
    ),
  );
};
