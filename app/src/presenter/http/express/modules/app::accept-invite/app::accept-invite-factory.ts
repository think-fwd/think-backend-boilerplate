import { prisma } from '@data/database/prisma';
import { DateUtil } from '@domain/utils/date';
import { mongoInstance } from '@data/database/mongodb';
import { AppAcceptInviteController } from './app::accept-invite-controller';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { PrismaMemberUpdateRepository } from '@data/database/prisma/repositories/prisma_member_update_repository';
import { UserMemberHandleInviteUsecase } from '@domain/modules/user::member_handle_invite/user::member_handle_invite_usecase';

export const appAcceptInviteFactory = () => {
  return new AppAcceptInviteController(
    new UserMemberHandleInviteUsecase(
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
      new PrismaMemberUpdateRepository(prisma),
    ),
  );
};
