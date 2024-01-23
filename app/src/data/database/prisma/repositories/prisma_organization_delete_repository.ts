import { PrismaClient } from '.prisma/client';
import { OrganizationEntity } from '@domain/entities/organization_entity';

import {
  OrganizationDeleteRepositoryProps,
  IOrganizationDeleteRepository,
} from '@domain/repositories/database/organization_delete_repository';

export class PrismaOrganizationDeleteRepository
  implements IOrganizationDeleteRepository
{
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: OrganizationDeleteRepositoryProps,
  ): Promise<OrganizationEntity> => {
    try {
      const deletedOrganization = await this.prismaClient.organization.delete({
        where: props,
      });
      return deletedOrganization as OrganizationEntity;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Não foi possível encontrar a organização');
      } else if (error.meta.cause) {
        throw new Error(error.meta.cause);
      } else {
        throw new Error('failed to delete organization');
      }
    }
  };
}
