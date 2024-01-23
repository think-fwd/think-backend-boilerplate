import { CognitoAuthRepository } from '@data/auth/cognito';
import { UserResetPasswordUsecase } from '@domain/modules/user::reset_password/user::reset_password_usecase';
import { UserResetPasswordController } from '@presenter/http/express/modules/user::reset_password/user::reset_password_controller';

export const userResetPasswordFactory = () => {
  return new UserResetPasswordController(
    new UserResetPasswordUsecase(new CognitoAuthRepository()),
  );
};
