import { PrismaClient } from '.prisma/client';
import { MemberEntity } from '@domain/entities/member_entity';
import {
  IMemberInsertRepository,
  MemberInsertRepositoryProps,
} from '@domain/repositories/database/member_insert_repository';

export class PrismaMemberInsertRepository implements IMemberInsertRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: MemberInsertRepositoryProps,
  ): Promise<MemberEntity> => {
    try {
      const member = await this.prismaClient.member.upsert({
        where: {
          email_organization_id: {
            email: props.data.email,
            organization_id: props.data.organization_id,
          },
        },
        create: {
          role: props.data.role,
          email: props.data.email,
          status: props.data.status,
          user_id: props.data.user_id,
          user_name: props.data.user_name,
          organization: { connect: { id: props.data.organization_id } },
          mail_attempt_at: props.data.mail_attempt_at,
          mail_attempt_code: props.data.mail_attempt_code,
        },
        update: {
          role: props.data.role,
          user_id: props.data.user_id,
          user_name: props.data.user_name,
        },
      });
      return member as MemberEntity;
    } catch (error) {
      console.log('error', error.message);
      throw new Error('failed to insert member');
    }
  };
}
