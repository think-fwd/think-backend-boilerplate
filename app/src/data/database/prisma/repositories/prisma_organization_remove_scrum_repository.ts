import { PrismaClient } from '.prisma/client';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import {
  IOrganizationRemoveScrumRepository,
  OrganizationRemoveScrumRepositoryProps,
} from '@domain/repositories/database/organization_remove_scrum_repository';

export class PrismaOrganizationRemoveScrumRepository
  implements IOrganizationRemoveScrumRepository
{
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: OrganizationRemoveScrumRepositoryProps,
  ): Promise<OrganizationEntity> => {
    try {
      const organization = await this.prismaClient.organization.update({
        where: props.match,
        data: { scrum: { unset: true } },
        select: {
          id: true,
          name: true,
          status: true,
          document: true,
          created_at: true,
          updated_at: true,
          repository: {
            select: {
              status: true,
              provider: true,
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
