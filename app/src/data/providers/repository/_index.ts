/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import axios, { AxiosInstance } from 'axios';
import { DateUtil } from '@domain/utils/date';
import { OAuthResponseType } from '@domain/types/oauth_response_type';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import { ErrorInvalidRepositoryCredentials } from '@domain/i18n/messages';
import { IOrganizationUpdateAccountRepository } from '@domain/repositories/database/organization_update_account_repository';
import { IRepositoryProvider } from '@domain/providers/repository';
import { RepositoryUserEntity } from '@domain/entities/repository_user_entity';

export type RepositoryProviderConfigProps = {
  rest_api_url: string;
  oauth_url: string;
  oauth_provider: string;
  oauth_api_key: string;
  oauth_api_secret: string;
};

export class RepositoryProvider implements IRepositoryProvider {
  constructor(
    private readonly config: RepositoryProviderConfigProps,
    private readonly dateUtil: DateUtil,
    private readonly organizationUpdateAccountRepository: IOrganizationUpdateAccountRepository,
  ) {}

  resolve(
    _: OrganizationEntity,
    __?: OAuthResponseType,
  ): Promise<{
    authenticated_user: () => Promise<RepositoryUserEntity | null>;
  }> {
    throw new Error('Method not implemented.');
  }

  async authenticate(
    organization_id: string,
    code: string,
  ): Promise<OAuthResponseType> {
    try {
      const response = await axios.post(
        this.config.oauth_url,
        new URLSearchParams({
          code: code,
          grant_type: 'authorization_code',
          client_id: this.config.oauth_api_key,
          client_secret: this.config.oauth_api_secret,
          redirect_uri: `https://crm.staging.thinkforward.com.br/oauth_callback/repository/${this.config.oauth_provider}?organization_id=${organization_id}`,
        }),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (_.get(response, 'data.error')) {
        throw new Error(_.get(response, 'data.error_description'));
      }

      // add expiration date if returns from authentication
      let access_token_exp: undefined | number = undefined;
      if (response.data.expires_in) {
        access_token_exp =
          Math.floor(
            this.dateUtil.normalize(new Date(), true).toDate().getTime() / 1000,
          ) + response.data.expires_in;
      }

      // return credentials and expiration
      return {
        access_token: _.get(response, 'data.access_token'),
        refresh_token: _.get(response, 'data.refresh_token'),
        access_token_exp: access_token_exp,
      };
    } catch (error) {
      throw new ErrorInvalidRepositoryCredentials();
    }
  }

  async refreshtoken(refresh_token: string): Promise<OAuthResponseType> {
    try {
      const response = await axios.post(
        this.config.oauth_url,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
          client_id: this.config.oauth_api_key,
          client_secret: this.config.oauth_api_secret,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      return response.data;
    } catch (error) {
      throw new ErrorInvalidRepositoryCredentials();
    }
  }

  async rotatetoken(
    access_token: string,
    refresh_token: string | undefined,
    access_token_exp: number | undefined,
  ): Promise<
    { updated: boolean; status: 'connected' | 'expired' } & OAuthResponseType
  > {
    try {
      const timestamp = Math.floor(
        this.dateUtil.normalize(new Date(), true).toDate().getTime() / 1000,
      );

      // check if access_token and refresh_token has been expired
      const expired = timestamp > (access_token_exp || 0);

      // return new tokens if access_token has been expired
      // * only refresh if access_token_exp is defined
      // * if not defined, means that token never expires
      if (access_token_exp && expired) {
        if (!refresh_token) throw new Error('undefined refresh token');
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

  async setup(
    organization: OrganizationEntity,
    auth?: OAuthResponseType,
  ): Promise<AxiosInstance> {
    // rotate token if necessary
    const credentials = await this.rotatetoken(
      (auth?.access_token || organization.repository?.access_token) as string,
      (auth?.refresh_token || organization.repository?.refresh_token) as string,
      (auth?.access_token_exp ||
        organization.repository?.access_token_exp) as number,
    );

    // update credentials on database
    // if token was refreshed
    if (auth || credentials.updated) {
      await this.organizationUpdateAccountRepository.handle({
        kind: 'repository',
        organization_id: organization.id,
        status: credentials.status,
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        access_token_exp: credentials.access_token_exp,
      });
    }

    // return axios instance client
    return axios.create({
      baseURL: this.config.rest_api_url,
      headers: {
        Accept: `application/json`,
        Authorization: `Bearer ${credentials.access_token}`,
      },
    });
  }
}
