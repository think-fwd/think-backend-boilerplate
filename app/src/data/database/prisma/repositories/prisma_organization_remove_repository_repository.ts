import { PrismaClient } from '.prisma/client';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import {
  IOrganizationRemoveRepositoryRepository,
  OrganizationRemoveRepositoryRepositoryProps,
} from '@domain/repositories/database/organization_remove_repository_repository';

export class PrismaOrganizationRemoveRepositoryRepository
  implements IOrganizationRemoveRepositoryRepository
{
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: OrganizationRemoveRepositoryRepositoryProps,
  ): Promise<OrganizationEntity> => {
    try {
      const organization = await this.prismaClient.organization.update({
        where: props.match,
        data: { repository: { unset: true } },
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
              status: true,
              name: true,
              provider: true,
              url: true,
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
