import { CognitoAuthRepository } from '@data/auth/cognito';
import { IEventController } from '@presenter/http/express/interfaces/event_controller_interface';
import { UserRegistrationUsecase } from '@domain/modules/user::registration/user::registration_usecase';
import { UserRegistrationController } from '@presenter/http/express/modules/user::registration/user::registration_controller';

export const userRegistrationFactory = (): IEventController => {
  return new UserRegistrationController(
    new UserRegistrationUsecase(new CognitoAuthRepository()),
  );
};
