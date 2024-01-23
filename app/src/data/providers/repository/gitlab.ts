import { DateUtil } from '@domain/utils/date';
import { RepositoryProvider } from './_index';
import { IRepositoryProvider } from '@domain/providers/repository';
import { OAuthResponseType } from '@domain/types/oauth_response_type';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { RepositoryUserEntity } from '@domain/entities/repository_user_entity';
import { IOrganizationUpdateAccountRepository } from '@domain/repositories/database/organization_update_account_repository';

export class GitlabRepositoryProvider
  extends RepositoryProvider
  implements IRepositoryProvider
{
  constructor(
    dateUtil: DateUtil,
    organizationUpdateAccountRepository: IOrganizationUpdateAccountRepository,
  ) {
    super(
      {
        oauth_provider: 'gitlab',
        rest_api_url: 'https://gitlab.com/api/v4',
        oauth_url: 'https://gitlab.com/oauth/token',
        oauth_api_key: process.env.REPO_GITLAB_API_KEY!,
        oauth_api_secret: process.env.REPO_GITLAB_API_SECRET!,
      },
      dateUtil,
      organizationUpdateAccountRepository,
    );
  }
  async resolve(organization: OrganizationEntity, auth?: OAuthResponseType) {
    const client = await this.setup(organization, auth);
    return {
      authenticated_user: async (): Promise<RepositoryUserEntity | null> => {
        try {
          const response = await client.get('/user');
          return { name: response.data.name, username: response.data.username };
        } catch (error) {
          return null;
        }
      },
    };
  }
}
