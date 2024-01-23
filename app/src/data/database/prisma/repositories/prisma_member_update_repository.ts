import { PrismaClient } from '.prisma/client';
import { MemberEntity } from '@domain/entities/member_entity';
import {
  IMemberUpdateRepository,
  MemberUpdateRepositoryProps,
} from '@domain/repositories/database/member_update_repository';
import { ParserUtil } from '@domain/utils/parser';

export class PrismaMemberUpdateRepository implements IMemberUpdateRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: MemberUpdateRepositoryProps,
  ): Promise<MemberEntity> => {
    try {
      const member = await this.prismaClient.member.update({
        where: {
          id_organization_id: {
            organization_id: props.match.organization_id,
            id: props.match.id,
          },
        },
        data: ParserUtil.removeUndefindeds(props.data),
      });
      return member as MemberEntity;
    } catch (error) {
      console.log('error', error.message);
      throw new Error('failed to update member');
    }
  };
}
