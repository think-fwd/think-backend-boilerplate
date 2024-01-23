import { isAllowedPolicy } from './__policy';
import { userUpdateFactory } from '../modules/user::update/user::update_factory';

export default function (routes) {
  routes.put(
    '/users',
    isAllowedPolicy({}),
    async (req, res) => await userUpdateFactory().handle(req, res),
  );
}
