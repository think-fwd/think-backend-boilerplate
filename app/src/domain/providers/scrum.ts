import { OrganizationEntity } from '@domain/entities/organization_entity';
import { ScrumEntity } from '@domain/entities/scrum_entity';
import { OAuthResponseType } from '@domain/types/oauth_response_type';

export interface IScrumProvider {
  authenticate(code: string): Promise<OAuthResponseType>;
  refreshtoken(refresh_token: string): Promise<OAuthResponseType>;
  accountinfo(
    access_token: string,
  ): Promise<Pick<ScrumEntity, 'id' | 'name' | 'scopes' | 'url'>[]>;
  setup(organization: OrganizationEntity): Promise<{
    update_status: (statusMessage: string) => Promise<void>;
  }>;
}
