import { PrismaClient } from '.prisma/client';
import { MemberEntity } from '@domain/entities/member_entity';
import {
  IMemberDeleteRepository,
  MemberDeleteRepositoryProps,
} from '@domain/repositories/database/member_delete_repository';

export class PrismaMemberDeleteRepository implements IMemberDeleteRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: MemberDeleteRepositoryProps,
  ): Promise<MemberEntity> => {
    try {
      const member = await this.prismaClient.member.delete({
        where: {
          id_organization_id: {
            organization_id: props.match.organization_id,
            id: props.match.id,
          },
        },
      });
      return member as MemberEntity;
    } catch (error) {
      console.log('error', error.message);
      throw new Error('failed to delete member');
    }
  };
}
