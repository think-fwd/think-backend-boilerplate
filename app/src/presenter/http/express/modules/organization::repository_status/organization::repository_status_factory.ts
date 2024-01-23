import { DateUtil } from '@domain/utils/date';
import { mongoInstance } from '@data/database/mongodb';
import { GithubRepositoryProvider } from '@data/providers/repository/github';
import { GitlabRepositoryProvider } from '@data/providers/repository/gitlab';
import { BitbucketRepositoryProvider } from '@data/providers/repository/bitbucket';
import { OrganizationRepositoryStatusController } from './organization::repository_status_controller';
import { MongoOrganizationFindRepository } from '@data/database/mongodb/repositories/mongo_organization_find_repository';
import { MongoOrganizationUpdateAccountRepository } from '@data/database/mongodb/repositories/mongo_organization_update_account_repository';
import { OrganizationRepositoryStatusUsecase } from '@domain/modules/organization::repository_status/organization::repository_status_usecase';

export const organizationRepositoryStatusFactory = () => {
  const dateUtil = new DateUtil();
  const repo = new MongoOrganizationUpdateAccountRepository(mongoInstance);
  return new OrganizationRepositoryStatusController(
    new OrganizationRepositoryStatusUsecase(
      new MongoOrganizationFindRepository(mongoInstance),
      {
        bitbucket: new BitbucketRepositoryProvider(dateUtil, repo),
        gitlab: new GitlabRepositoryProvider(dateUtil, repo),
        github: new GithubRepositoryProvider(dateUtil, repo),
      },
    ),
  );
};
