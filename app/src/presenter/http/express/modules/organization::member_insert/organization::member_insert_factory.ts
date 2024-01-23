import { DateUtil } from '@domain/utils/date';
import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { SignatureUtil } from '@domain/utils/signature';
import { OrganizationMemberInsertController } from './organization::member_insert_controller';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberInsertRepository } from '@data/database/prisma/repositories/prisma_member_insert_repository';
import { OrganizationMembersInsertUsecase } from '@domain/modules/organization::members_insert/organization::members_insert_usecase';
import { CognitoAuthRepository } from '@data/auth/cognito';

export const organizationMemberInsertFactory = () => {
  const dateUtil = new DateUtil();
  return new OrganizationMemberInsertController(
    new OrganizationMembersInsertUsecase(
      dateUtil,
      new SignatureUtil(process.env.SIGNATURE_SECRET!),
      new CognitoAuthRepository(),
      new MongoMemberFindRepository(dateUtil, mongoInstance),
      new PrismaMemberInsertRepository(prisma),
    ),
  );
};
