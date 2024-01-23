import { validate } from '@domain/utils/validate';
import { RepositoryProvider } from '@data/providers/repository/_index';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { RepositoryProviderEnumKeys } from '@domain/enums/repository_provider_enum';
import { OrganizationSetupRepositoryAccountDto } from './organization::setup_repository_account_dto';
import { IOrganizationUpdateRepository } from '@domain/repositories/database/organization_update_repository';
import { OrganizationSetupRepositoryAccountValidator } from './organization::setup_repository_account_validator';

import {
  ErrorOauthRepositoryMissingAccessToken,
  MissingPropsError,
} from '@domain/i18n/messages';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';

export class OrganizationSetupRepositoryAccountUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
    private readonly organizationUpdateRepository: IOrganizationUpdateRepository,
    private readonly repositoryProviders: Record<
      RepositoryProviderEnumKeys,
      RepositoryProvider
    >,
  ) {}

  public handle = async (
    props: OrganizationSetupRepositoryAccountDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationSetupRepositoryAccountValidator);

    // authenticate to repository provider
    const auth = await this.repositoryProviders[props.provider].authenticate(
      props.organizationId,
      props.code,
    );

    // throw an error if authentication does not returns an aaccess_token
    if (!auth.access_token) throw new ErrorOauthRepositoryMissingAccessToken();

    // get oprganization data
    const [organization] = (await this.organizationFindRepository.handle({
      match: { id: props.organizationId },
    })) as OrganizationEntity[];

    // get account details
    const client = await this.repositoryProviders[props.provider].resolve(
      organization,
      auth,
    );
    const account = await client.authenticated_user();

    // update organization data with repository account setup
    return await this.organizationUpdateRepository.handle({
      match: { id: props.organizationId },
      data: {
        repository: {
          status: 'connected',
          name: account?.username || 'unknown',
          provider: props.provider,
          access_token: auth.access_token,
          refresh_token: auth.refresh_token,
          access_token_exp: auth.access_token_exp,
        },
      },
    });
  };
}
