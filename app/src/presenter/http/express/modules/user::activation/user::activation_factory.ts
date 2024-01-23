import { DateUtil } from '@domain/utils/date';
import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { CognitoAuthRepository } from '@data/auth/cognito';
import { UserActivationController } from './user::activation_controller';
import { UserActivationUsecase } from '@domain/modules/user::activation/user::activation_usecase';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberUpdateRepository } from '@data/database/prisma/repositories/prisma_member_update_repository';

export const userActivationFactory = () => {
  return new UserActivationController(
    new UserActivationUsecase(
      new CognitoAuthRepository(),
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
      new PrismaMemberUpdateRepository(prisma),
    ),
  );
};
