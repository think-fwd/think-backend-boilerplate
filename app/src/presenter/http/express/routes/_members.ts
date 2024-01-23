import { isAllowedPolicy } from './__policy';
import { MemberRoleEnum } from '@domain/enums/member_role_enum';
import { userMemberInviteFactory } from '../modules/user::member_handle_invite/user::member_handle_invite_factory';
import { organizationMemberDeleteFactory } from '../modules/organization::member_delete/organization::member_delete_factory';
import { organizationMemberUpdateFactory } from '../modules/organization::member_update/organization::member_update_factory';
import { organizationMembderFindFactory } from '@presenter/http/express/modules/organization::member_find/organization::member_find_factory';
import { organizationMemberInsertFactory } from '@presenter/http/express/modules/organization::member_insert/organization::member_insert_factory';
import { organizationMemberReinviteFactory } from '../modules/organization::member_reinvite/organization::member_reinvite_factory';
import { appAcceptInviteFactory } from '../modules/app::accept-invite/app::accept-invite-factory';

// organization sellers oprations
export default function (routes) {
  routes.post(
    '/organizations/:organization_id/members',
    isAllowedPolicy({
      allowed_for_admin: false,
      allowed_for_organization: {
        id_path: 'params.organization_id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationMemberInsertFactory().handle(req, res),
  );
  routes.get(
    '/organizations/:organization_id/members',
    isAllowedPolicy({
      allowed_for_admin: false,
      allowed_for_organization: {
        id_path: 'params.organization_id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) => await organizationMembderFindFactory().handle(req, res),
  );
  routes.put(
    '/organizations/:organization_id/members/:id',
    isAllowedPolicy({
      allowed_for_admin: false,
      allowed_for_organization: {
        id_path: 'params.organization_id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationMemberUpdateFactory().handle(req, res),
  );
  routes.delete(
    '/organizations/:organization_id/members/:id',
    isAllowedPolicy({
      allowed_for_admin: false,
      allowed_for_organization: {
        id_path: 'params.organization_id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationMemberDeleteFactory().handle(req, res),
  );
  routes.post(
    '/organizations/:organization_id/members/:id/reinvite',
    isAllowedPolicy({
      allowed_for_admin: false,
      allowed_for_organization: {
        id_path: 'params.organization_id',
        roles: [MemberRoleEnum.ADMIN],
      },
    }),
    async (req, res) =>
      await organizationMemberReinviteFactory().handle(req, res),
  );
  routes.post(
    '/members/:id/:action',
    isAllowedPolicy({}),
    async (req, res) => await userMemberInviteFactory().handle(req, res),
  );
  routes.post(
    '/accept-invite',
    async (req, res) => await appAcceptInviteFactory().handle(req, res),
  );
}
