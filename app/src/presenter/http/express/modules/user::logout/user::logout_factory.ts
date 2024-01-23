import { UserLogoutController } from './user::logout_controller';

export const userLogoutFactory = () => {
  return new UserLogoutController();
};
