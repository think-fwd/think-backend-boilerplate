import _ from 'lodash';
import { JwtUtil } from '@domain/utils/jwt';
import axios, { AxiosInstance } from 'axios';
import { DateUtil } from '@domain/utils/date';
import { IScrumProvider } from '@domain/providers/scrum';
import { ScrumEntity } from '@domain/entities/scrum_entity';
import { ErrorInvalidScrumCredentials } from '@domain/i18n/messages';
import { OAuthResponseType } from '@domain/types/oauth_response_type';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { IOrganizationUpdateAccountRepository } from '@domain/repositories/database/organization_update_account_repository';

export class JiraScrumRepository implements IScrumProvider {
  client: AxiosInstance;

  constructor(
    private readonly dateUtil: DateUtil,
    private readonly jwtUtil: JwtUtil,
    private readonly organizationUpdateAccountRepository: IOrganizationUpdateAccountRepository,
  ) {}

  async authenticate(code: string): Promise<OAuthResponseType> {
    try {
      const response = await axios.post(
        'https://auth.atlassian.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.SCRUM_JIRA_API_KEY!,
          client_secret: process.env.SCRUM_JIRA_API_SECRET!,
          code: code,
          redirect_uri:
            'https://crm.staging.thinkforward.com.br/oauth_callback/scrum/jira',
        },
      );
      return response.data;
    } catch (error) {
      throw new ErrorInvalidScrumCredentials();
    }
  }

  async refreshtoken(refresh_token: string): Promise<OAuthResponseType> {
    try {
      const response = await axios.post(
        'https://auth.atlassian.com/oauth/token',
        {
          grant_type: 'refresh_token',
          client_id: process.env.SCRUM_JIRA_API_KEY!,
          client_secret: process.env.SCRUM_JIRA_API_SECRET!,
          refresh_token: refresh_token,
        },
      );
      return response.data;
    } catch (error) {
      throw new ErrorInvalidScrumCredentials();
    }
  }

  async accountinfo(
    access_token: string,
  ): Promise<Pick<ScrumEntity, 'id' | 'name' | 'scopes' | 'url'>[]> {
    try {
      const response = await axios.get(
        'https://api.atlassian.com/oauth/token/accessible-resources',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new ErrorInvalidScrumCredentials();
    }
  }

  async rotatetoken(
    access_token: string,
    refresh_token: string,
    access_token_exp: number | undefined,
  ): Promise<
    { updated: boolean; status: 'connected' | 'expired' } & OAuthResponseType
  > {
    try {
      const timestamp = Math.floor(
        this.dateUtil.normalize(new Date(), true).toDate().getTime() / 1000,
      );

      // decode access_token and refresh token
      const atp = this.jwtUtil.decode(access_token);
      const rtp = this.jwtUtil.decode(access_token);

      // check if access_token and refresh_token has been expired
      const access_token_expired = timestamp > _.get(atp, 'payload.exp', 0);
      const refresh_token_expired = timestamp > _.get(rtp, 'payload.exp', 0);

      // throw an error if both access_token and refresh_token has been epxired
      if (access_token_expired && refresh_token_expired) {
        throw new Error('You need to reauthenticate');
      }

      // return new tokens if access_token has been expired
      if (access_token_exp) {
        const credentials = await this.refreshtoken(refresh_token);
        return {
          updated: true,
          status: 'connected',
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          access_token_exp: credentials.access_token_exp,
        };
      }

      // return both still valid tokens
      return {
        updated: false,
        status: 'connected',
        access_token,
        refresh_token,
        access_token_exp,
      };
    } catch (error) {
      return {
        updated: true,
        status: 'expired',
        access_token,
        refresh_token,
        access_token_exp,
      };
    }
  }

  async setup(organization: OrganizationEntity) {
    // rotate token if necessary
    const credentials = await this.rotatetoken(
      organization.scrum?.access_token as string,
      organization.scrum?.refresh_token as string,
      organization.scrum?.access_token_exp as number,
    );

    // update credentials on database
    // if token was refreshed
    if (credentials.updated) {
      await this.organizationUpdateAccountRepository.handle({
        kind: 'scrum',
        organization_id: organization.id,
        status: credentials.status,
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        access_token_exp: credentials.access_token_exp,
      });
    }

    // create jira api client
    const client = axios.create({
      baseURL: `https://api.atlassian.com/ex/jira/${organization.scrum?.id}/rest/api/3`,
      headers: { Authorization: `Bearer ${credentials.access_token}` },
    });

    // return availabel resources
    return {
      update_status: async (statusMessage: string) => {
        try {
          await client.put(`/announcementBanner`, {
            visibility: 'public',
            isDismissible: false,
            isEnabled: true,
            message: statusMessage,
          });
        } catch (error) {
          throw new ErrorInvalidScrumCredentials();
        }
      },
    };
  }
}
