import { PrismaClient } from '.prisma/client';
import { OrganizationEntity } from '@domain/entities/organization_entity';
import {
  OrganizationInsertRepositoryProps,
  IOrganizationInsertRepository,
} from '@domain/repositories/database/organization_insert_repository';

export class PrismaOrganizationInsertRepository
  implements IOrganizationInsertRepository
{
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public handle = async (
    props: OrganizationInsertRepositoryProps,
  ): Promise<OrganizationEntity> => {
    try {
      const { user_id, user_email, user_name, ...data } = props.data;
      const organization = await this.prismaClient.organization.create({
        data: {
          ...data,
          members: {
            create: {
              role: 'ADMIN',
              status: 'ACCEPTED',
              blocked: false,
              user_id: user_id,
              user_name: user_name,
              email: user_email,
            },
          },
        },
      });
      return organization as OrganizationEntity;
    } catch (error) {
      console.log('error', error.message);
      throw new Error('failed to create organization');
    }
  };
}
