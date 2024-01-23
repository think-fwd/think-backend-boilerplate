import { DateUtil } from '@domain/utils/date';
import { RepositoryProvider } from './_index';
import { IRepositoryProvider } from '@domain/providers/repository';
import { OAuthResponseType } from '@domain/types/oauth_response_type';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { RepositoryUserEntity } from '@domain/entities/repository_user_entity';
import { IOrganizationUpdateAccountRepository } from '@domain/repositories/database/organization_update_account_repository';

export class GithubRepositoryProvider
  extends RepositoryProvider
  implements IRepositoryProvider
{
  constructor(
    dateUtil: DateUtil,
    organizationUpdateAccountRepository: IOrganizationUpdateAccountRepository,
  ) {
    super(
      {
        oauth_provider: 'github',
        rest_api_url: 'https://api.github.com',
        oauth_url: 'https://github.com/login/oauth/access_token',
        oauth_api_key: process.env.REPO_GITHUB_API_KEY!,
        oauth_api_secret: process.env.REPO_GITHUB_API_SECRET!,
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
          return {
            name: response.data.name,
            username: response.data.login,
          };
        } catch (error) {
          return null;
        }
      },
    };
  }
}
