import { CognitoAuthRepository } from '@data/auth/cognito';
import { UserForgotPasswordUsecase } from '@domain/modules/user::forgot_password/user::forgot_password_usecase';
import { UserForgotPasswordController } from '@presenter/http/express/modules/user::forgot_password/user::forgot_password_controller';

export const userForgotPasswordFactory = () => {
  return new UserForgotPasswordController(
    new UserForgotPasswordUsecase(new CognitoAuthRepository()),
  );
};
