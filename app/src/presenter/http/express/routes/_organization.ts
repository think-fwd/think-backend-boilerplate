import { isAllowedPolicy } from './__policy';
import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import { userOrganizationFindFactory } from '../modules/user::organization_find/user::organization_find_factory';
import { organizationSetupDoneFactory } from '../modules/organization::setup_done/organization::setup_done_factory';
import { userOrganizationDeleteFactory } from '../modules/user::organization_delete/user::organization_delete_factory';
import { userOrganizationUpdateFactory } from '../modules/user::organization_update/user::organization_update_factory';
import { userOrganizationInsertFactory } from '../modules/user::organization_insert/user::organization_insert_facotry';
import { userOrganizationDetailsFactory } from '../modules/user::organization_details/admin::organization_details_factory';
import { organizationRepositoryStatusFactory } from '../modules/organization::repository_status/organization::repository_status_factory';
import { organizationSetupScrumAccountFactory } from '../modules/organization::setup_scrum_account/organization::setup_scrum_account_factory';
import { organizationRemoveScrumAccountFactory } from '../modules/organization::remove_scrum_account/organization::remove_scrum_account_factory';
import { organizationSetupRepositoryAccountFactory } from '../modules/organization::setup_repository_account/organization::setup_repository_account_factory';
import { organizationRemoveRepositoryAccountFactory } from '../modules/organization::remove_repository_account/organization::remove_repository_account_factory';

export default function (routes) {
  routes.get(
    '/organizations',
    isAllowedPolicy({ allowed_for_admin: true }),
    async (req, res) => await userOrganizationFindFactory().handle(req, res),
  );
  routes.post(
    '/organizations',
    isAllowedPolicy({}),
    async (req, res) => await userOrganizationInsertFactory().handle(req, res),
  );
  routes.get(
    '/organizations/:id',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [
          MemberRoleEnum.ADMIN,
          MemberRoleEnum.EDITOR,
          MemberRoleEnum.VIEWER,
        ],
      },
    }),
    async (req, res) => await userOrganizationDetailsFactory().handle(req, res),
  );
  routes.put(
    '/organizations/:id',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) => await userOrganizationUpdateFactory().handle(req, res),
  );
  routes.delete(
    '/organizations/:id',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) => await userOrganizationDeleteFactory().handle(req, res),
  );

  routes.post(
    '/organizations/:id/setup/scrum',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationSetupScrumAccountFactory().handle(req, res),
  );

  routes.delete(
    '/organizations/:id/scrum',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationRemoveScrumAccountFactory().handle(req, res),
  );

  routes.post(
    '/organizations/:id/setup/repository',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationSetupRepositoryAccountFactory().handle(req, res),
  );

  routes.delete(
    '/organizations/:id/repository',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationRemoveRepositoryAccountFactory().handle(req, res),
  );

  routes.get(
    '/organizations/:id/repository/status',
    isAllowedPolicy({
      allowed_for_admin: true,
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationRepositoryStatusFactory().handle(req, res),
  );

  routes.get(
    '/organizations/:id/setup/done',
    isAllowedPolicy({
      allowed_for_organization: {
        id_path: 'params.id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) => await organizationSetupDoneFactory().handle(req, res),
  );
}
