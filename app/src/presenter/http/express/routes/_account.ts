import { isAllowedPolicy } from './__policy';
import { userLoginFactory } from '../modules/user::login/user::login_factory';
import { userLogoutFactory } from '../modules/user::logout/user::logout_factory';
import { userWssTokenFactory } from '../modules/user::wsstoken/user::wsstoken_factory';
import { userActivationFactory } from '../modules/user::activation/user::activation_factory';
import { userRegistrationFactory } from '../modules/user::registration/user::registration_factory';
import { userResetPasswordFactory } from '../modules/user::reset_password/user::reset_password_factory';
import { userSessionFactory } from '@presenter/http/express/modules/user::session/user::session_factory';
import { userForgotPasswordFactory } from '../modules/user::forgot_password/user::forgot_password_factory';

export default function (routes) {
  routes.post(
    '/signup',
    async (req, res) => await userRegistrationFactory().handle(req, res),
  );
  routes.post(
    '/activate',
    async (req, res) => await userActivationFactory().handle(req, res),
  );
  routes.post(
    '/login',
    async (req, res) => await userLoginFactory().handle(req, res),
  );
  routes.post(
    '/logout',
    async (req, res) => await userLogoutFactory().handle(req, res),
  );
  routes.post(
    '/forgot-password',
    async (req, res) => await userForgotPasswordFactory().handle(req, res),
  );
  routes.post(
    '/reset-password',
    async (req, res) => await userResetPasswordFactory().handle(req, res),
  );
  routes.get(
    '/session',
    isAllowedPolicy({}),
    async (req, res) => await userSessionFactory().handle(req, res),
  );
  routes.get(
    '/wsstoken',
    isAllowedPolicy({}),
    async (req, res) => await userWssTokenFactory().handle(req, res),
  );
}
