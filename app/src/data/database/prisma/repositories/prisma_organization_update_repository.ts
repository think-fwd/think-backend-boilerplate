import { PrismaClient } from '.prisma/client';
import { ParserUtil } from '@domain/utils/parser';
import { OrganizationEntity } from '@domain/entities/organization_entity';

import {
  OrganizationUpdateRepositoryProps,
  IOrganizationUpdateRepository,
} from '@domain/repositories/database/organization_update_repository';

export class PrismaOrganizationUpdateRepository
  implements IOrganizationUpdateRepository
{
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: OrganizationUpdateRepositoryProps,
  ): Promise<OrganizationEntity> => {
    try {
      const organization = await this.prismaClient.organization.update({
        where: props.match,
        data: ParserUtil.removeUndefindeds(props.data),
        select: {
          id: true,
          name: true,
          status: true,
          document: true,
          created_at: true,
          updated_at: true,
          scrum: {
            select: {
              id: true,
              name: true,
              status: true,
              provider: true,
              access_token_exp: true,
            },
          },
          repository: {
            select: {
              name: true,
              status: true,
              provider: true,
              access_token_exp: true,
            },
          },
        },
      });
      return organization as OrganizationEntity;
    } catch (error) {
      console.log('error', error.message);
      throw new Error('failed to update organization');
    }
  };
}
