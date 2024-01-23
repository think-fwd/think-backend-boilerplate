import { DateUtil } from '@domain/utils/date';
import { validate } from '@domain/utils/validate';
import { ScrumProviderEnumKeys } from '@domain/enums/scrum_provider_enum';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { IScrumProvider } from '@domain/providers/scrum';
import { OrganizationSetupScrumAccountDto } from './organization::setup_scrum_account_dto';
import { OrganizationSetupScrumAccountValidator } from './organization::setup_scrum_account_validator';
import { IOrganizationUpdateRepository } from '@domain/repositories/database/organization_update_repository';

import {
  MissingPropsError,
  ErrorInvalidScrumAccount,
} from '@domain/i18n/messages';

export class OrganizationSetupScrumAccountUsecase {
  constructor(
    private readonly dateUtil: DateUtil,
    private readonly organizationUpdateRepository: IOrganizationUpdateRepository,
    private readonly scrumProviders: Record<
      ScrumProviderEnumKeys,
      IScrumProvider
    >,
  ) {}

  public handle = async (
    props: OrganizationSetupScrumAccountDto,
  ): Promise<OrganizationEntity> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, OrganizationSetupScrumAccountValidator);

    // authenticate to scrum provider
    const auth = await this.scrumProviders[props.provider].authenticate(
      props.code,
    );

    // get account information
    const [accountinfo] = await this.scrumProviders[props.provider].accountinfo(
      auth.access_token,
    );

    // throw an error if cannot find account
    if (!accountinfo) throw new ErrorInvalidScrumAccount();

    // update scrum banner status for users knowledgement
    const date = this.dateUtil.normalize(new Date(), true);
    const client = await this.scrumProviders[props.provider].setup({
      id: props.organizationId,
      scrum: {
        id: accountinfo.id,
        access_token: auth.access_token,
        refresh_token: auth.refresh_token,
      },
    } as OrganizationEntity);
    await client.update_status(
      `A ThinkForward está controlando sua conta. 🚀 - Ultima Interação ${date.format(
        'DD/MM/YYYY',
      )} ás ${date.format('HH:mm')}`,
    );

    // update organization data with scrum account setup
    return await this.organizationUpdateRepository.handle({
      match: { id: props.organizationId },
      data: {
        scrum: {
          status: 'connected',
          provider: props.provider,
          access_token: auth.access_token,
          refresh_token: auth.refresh_token,
          id: accountinfo.id,
          url: accountinfo.url,
          name: accountinfo.name,
          scopes: accountinfo.scopes,
        },
      },
    });
  };
}
