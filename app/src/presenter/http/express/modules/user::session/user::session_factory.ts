import { UserSessionUsecase } from '@domain/modules/user:session/user::session_usecase';
import { UserSessionController } from './user::session_controller';
export const userSessionFactory = () => {
  return new UserSessionController(new UserSessionUsecase());
};
