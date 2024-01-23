import { CognitoAuthRepository } from '@data/auth/cognito';
import { mongoInstance } from '@data/database/mongodb';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { UserLoginUsecase } from '@domain/modules/user::login/user::login_usecase';
import { DateUtil } from '@domain/utils/date';
import { UserLoginController } from '@presenter/http/express/modules/user::login/user::login_controller';

export const userLoginFactory = () => {
  return new UserLoginController(
    new UserLoginUsecase(
      new CognitoAuthRepository(),
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
    ),
  );
};
