import { DateUtil } from '@domain/utils/date';
import { RepositoryProvider } from './_index';
import { IRepositoryProvider } from '@domain/providers/repository';
import { OAuthResponseType } from '@domain/types/oauth_response_type';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { RepositoryUserEntity } from '@domain/entities/repository_user_entity';
import { IOrganizationUpdateAccountRepository } from '@domain/repositories/database/organization_update_account_repository';

export class BitbucketRepositoryProvider
  extends RepositoryProvider
  implements IRepositoryProvider
{
  constructor(
    dateUtil: DateUtil,
    organizationUpdateAccountRepository: IOrganizationUpdateAccountRepository,
  ) {
    super(
      {
        oauth_provider: 'bitbucket',
        rest_api_url: 'https://api.bitbucket.org/2.0',
        oauth_url: 'https://bitbucket.org/site/oauth2/access_token',
        oauth_api_key: process.env.REPO_BITBUCKET_API_KEY!,
        oauth_api_secret: process.env.REPO_BITBUCKET_API_SECRET!,
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
            username: response.data.username,
            name: response.data.display_name,
          };
        } catch (error) {
          return null;
        }
      },
    };
  }
}
