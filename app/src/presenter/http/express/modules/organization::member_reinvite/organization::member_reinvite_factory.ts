import { DateUtil } from '@domain/utils/date';
import { prisma } from '@data/database/prisma';
import { mongoInstance } from '@data/database/mongodb';
import { SignatureUtil } from '@domain/utils/signature';
import { OrganizationMemberReinviteController } from './organization::member_reinvite_controller';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberUpdateRepository } from '@data/database/prisma/repositories/prisma_member_update_repository';
import { OrganizationMembersReinviteUsecase } from '@domain/modules/organization::members_reinvite/organization::members_reinvite_usecase';

export const organizationMemberReinviteFactory = () => {
  const dateUtil = new DateUtil();
  return new OrganizationMemberReinviteController(
    new OrganizationMembersReinviteUsecase(
      dateUtil,
      new SignatureUtil(process.env.SIGNATURE_SECRET!),
      new MongoMemberFindRepository(dateUtil, mongoInstance),
      new PrismaMemberUpdateRepository(prisma),
    ),
  );
};
