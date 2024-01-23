import _ from 'lodash';
import axios from 'axios';
import AWS from 'aws-sdk';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { AWSProvider } from '@data/aws';
import { JwtType } from '@domain/types/jwt_type';
import { UserEntity } from '@domain/entities/user_entity';

import {
  AuthCredentialsDto,
  AuthResetPasswordDto,
  CreateUserDto,
  IAuthRepository,
} from '@domain/repositories/auth/auth_repository';

export class CognitoAuthRepository
  extends AWSProvider
  implements IAuthRepository
{
  client: AWS.CognitoIdentityServiceProvider;
  userPoolId: string;
  clientId: string;
  clientSecret: string;

  constructor() {
    super();
    this.userPoolId = process.env.COGNITO_POOL_ID!;
    this.clientId = process.env.COGNITO_CLIENT_ID!;
    this.clientSecret = process.env.COGNITO_CLIENT_SECRET!;
    this.client = new AWS.CognitoIdentityServiceProvider(this.buildConfig());
  }

  private parseAttributesToUser(
    attributes:
      | AWS.CognitoIdentityServiceProvider.AttributeListType
      | undefined,
  ): UserEntity | undefined {
    if (!attributes) return undefined;
    return attributes.reduce((data, item) => {
      const attr = item.Name.startsWith('custom:')
        ? item.Name.substring(7)
        : item.Name;
      data[attr] = ['true', 'false'].includes(String(item.Value))
        ? item.Value === 'true'
        : item.Value;
      return data;
    }, {}) as unknown as UserEntity;
  }

  private hashSecret(username: string): string {
    return crypto
      .createHmac('SHA256', this.clientSecret)
      .update(username + this.clientId)
      .digest('base64');
  }

  async generatePem(): Promise<Record<string, string>> {
    const url = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
    const { data } = await axios.get(url);
    const { keys } = data;
    return keys.reduce((pems, key) => {
      pems[key.kid] = jwkToPem(key);
      return pems;
    }, {});
  }

  async userSignIn(payload: AuthCredentialsDto): Promise<JwtType | null> {
    // request user authentication
    try {
      const response = await this.client
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.clientId,
          AuthParameters: {
            USERNAME: payload.email,
            PASSWORD: payload.password,
            SECRET_HASH: this.hashSecret(payload.email),
          },
        })
        .promise();

      // get user identitie
      const userData = jwt.decode(
        response.AuthenticationResult?.IdToken as string,
        { complete: true },
      );

      // return authenticated user
      return {
        jwt: response.AuthenticationResult?.AccessToken as string,
        user: {
          sub: _.get(userData, 'payload.sub') as unknown as string,
          email: _.get(userData, 'payload.email') as unknown as string,
          name: _.get(userData, 'payload.name') as unknown as string,
          picture: _.get(userData, 'payload.picture') as unknown as string,
          admin: _.get(userData, 'payload.custom:admin') === 'true',
          status: _.get(userData, 'payload.custom:status') as unknown as string,
          connection_id: _.get(
            userData,
            'payload.custom:connection_id',
          ) as unknown as string,
          phone_number: _.get(
            userData,
            'payload.phone_number',
          ) as unknown as string,
          email_verified: _.get(
            userData,
            'payload.email_verified',
          ) as unknown as boolean,
        },
      };
    } catch (error) {
      return null;
    }
  }

  async userSignUp(payload: CreateUserDto): Promise<string> {
    // spread user credentials
    const { email, password, ...attributes } = payload;

    // mount user attributes
    const UserAttributes = Object.keys(attributes)
      .filter(key => !!attributes[key])
      .map(key => ({
        Name: key,
        Value: attributes[key],
      }));

    // create user account
    const response = await this.client
      .signUp({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        SecretHash: this.hashSecret(email),
        UserAttributes: UserAttributes,
      })
      .promise();

    // return created user id
    return response.UserSub;
  }

  async userActivation(username: string, code: string): Promise<boolean> {
    await this.client
      .confirmSignUp({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
        SecretHash: this.hashSecret(username),
      })
      .promise();
    return true;
  }

  public async forgotPassword(email: string): Promise<boolean> {
    await this.client
      .forgotPassword({
        ClientId: this.clientId,
        Username: email,
        SecretHash: this.hashSecret(email),
      })
      .promise();
    return true;
  }

  public async resetPassword(payload: AuthResetPasswordDto): Promise<boolean> {
    await this.client
      .confirmForgotPassword({
        ClientId: this.clientId,
        ConfirmationCode: payload.code,
        Password: payload.password,
        Username: payload.email,
        SecretHash: this.hashSecret(payload.email),
      })
      .promise();
    return true;
  }
  async session(token: string): Promise<UserEntity> {
    const data = await this.client
      .getUser({
        AccessToken: token,
      })
      .promise();
    return this.parseAttributesToUser(data.UserAttributes) as UserEntity;
  }

  async updateUser(
    token: string,
    attributes: Partial<UserEntity>,
  ): Promise<UserEntity> {
    if (attributes.connection_id != undefined) {
      _.set(attributes, 'custom:connection_id', attributes.connection_id);
      _.unset(attributes, 'connection_id');
    }
    if (attributes.admin != undefined) {
      _.set(attributes, 'custom:admin', attributes.admin);
      _.unset(attributes, 'admin');
    }
    if (attributes.status != undefined) {
      _.set(attributes, 'custom:status', attributes.status);
      _.unset(attributes, 'status');
    }

    // convert update user payload
    const UserAttributes = Object.keys(attributes).map(key => ({
      Name: key,
      Value: attributes[key],
    }));

    // update user data
    await this.client
      .updateUserAttributes({
        AccessToken: token,
        UserAttributes: UserAttributes,
      })
      .promise();

    // return updated user
    return await this.session(token);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      console.log(
        `Finding user by email (${email}) on user pool ${this.userPoolId}`,
      );
      const data = await this.client
        .adminGetUser({
          UserPoolId: this.userPoolId,
          Username: email,
        })
        .promise();
      console.log('founded user', data);
      console.log(
        'parsed attributes',
        this.parseAttributesToUser(data.UserAttributes),
      );
      return this.parseAttributesToUser(data.UserAttributes);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
