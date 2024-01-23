import _ from 'lodash';
import { validate } from '@domain/utils/validate';
import { IsAllowedPolicyDto } from './is_allowed_dto';
import { handleError } from '../../utils/handle_error';
import { NextFunction, Request, Response } from 'express';
import { IsAllowedPolicyValidator } from './is_allowed_validator';

import {
  UserNotFoundedError,
  ErrorUserDoesNotHavePermission,
} from '@domain/i18n/messages';

export class IsAllowedPolicyUsecase {
  constructor(private readonly config: IsAllowedPolicyDto) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // throw error if cannot find user
      if (!req.user) throw new UserNotFoundedError();

      // skip validation if does not needs
      // to be auth on admin or organization
      if (
        !this.config.allowed_for_admin &&
        !this.config.allowed_for_organization
      ) {
        return next();
      }

      // validate content data to prevent
      // native errors from database
      await validate(
        { user: req.user, ...this.config },
        IsAllowedPolicyValidator,
      );

      // define if user is admin or is not validating for users
      const userIsAdmin =
        this.config.allowed_for_admin && req.user.admin === true;

      // * 1 - if validate admin and is not admin
      if (this.config.allowed_for_admin && userIsAdmin) {
        return next();
      }

      // * 2 - if validate organization and user
      // belogns to organization with permission
      if (!this.config.allowed_for_organization) {
        throw new ErrorUserDoesNotHavePermission();
      }

      // throw if organization id was not provided
      if (!this.config.allowed_for_organization.id_path) {
        throw new ErrorUserDoesNotHavePermission();
      }

      // get user member for provided organization
      const member = (req.user.members || []).find(member => {
        return (
          String(member.organization_id) ===
          _.get(req, this.config.allowed_for_organization?.id_path as string)
        );
      });

      // throw error if user is not organization member
      if (!member) {
        throw new ErrorUserDoesNotHavePermission();
      }

      // throw error if user does not have
      // permission on its organization member
      if (!this.config.allowed_for_organization.roles.includes(member.role)) {
        throw new ErrorUserDoesNotHavePermission();
      }

      // user has permission to handle request
      return next();
    } catch (error: unknown) {
      return handleError(res, error as Record<string, unknown>);
    }
  };
}
