import { validate } from '@domain/utils/validate';
import {
  ErrorOauthRepositoryDisconnected,
  ErrorOauthRepositoryMissing,
  MissingPropsError,
} from '@domain/i18n/messages';
import { IRepositoryProvider } from '@domain/providers/repository';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { RepositoryProviderEnumKeys } from '@domain/enums/repository_provider_enum';
import { OrganizationRepositoryStatusDto } from './organization::repository_status_dto';
import { OrganizationRepositoryStatusValidator } from './organization::repository_status_validator';
import { IOrganizationFindRepository } from '@domain/repositories/database/organization_find_repository';

export class OrganizationRepositoryStatusUsecase {
  constructor(
    private readonly organizationFindRepository: IOrganizationFindRepository,
    private readonly repositoryProviders: Record<
      RepositoryProviderEnumKeys,
      IRepositoryProvider
    >,
  ) {}

  public handle = async (
    props: OrganizationRepositoryStatusDto,
  ): Promise<string> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationRepositoryStatusValidator);

    // get organization
    const [organization] = (await this.organizationFindRepository.handle({
      match: { id: props.organizationId },
    })) as OrganizationEntity[];

    // throw an error if cannot find repository config
    if (!organization.repository) {
      throw new ErrorOauthRepositoryMissing();
    }

    // throw an error repository is not connect
    if (organization.repository.status !== 'connected') {
      throw new ErrorOauthRepositoryDisconnected();
    }

    // setup repository provider
    const provider = await this.repositoryProviders[
      organization.repository.provider
    ].resolve(organization);

    // get authenticated user
    const authenticated_user = await provider.authenticated_user();

    return `Authenticated as ${authenticated_user?.username}`;
  };
}
