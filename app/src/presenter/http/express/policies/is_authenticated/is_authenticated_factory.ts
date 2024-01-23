import { JwtUtil } from '@domain/utils/jwt';
import { mongoInstance } from '@data/database/mongodb';
import { CognitoAuthRepository } from '@data/auth/cognito';
import { IPolicy } from '../../interfaces/policy_interface';
import { IsAuthenticatedPolicy } from './is_authenticated_policy';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { DateUtil } from '@domain/utils/date';

export const isAuthenticatedFactory = (): IPolicy => {
  return new IsAuthenticatedPolicy(
    new JwtUtil(),
    new CognitoAuthRepository(),
    new MongoMemberFindRepository(new DateUtil(), mongoInstance),
  );
};
