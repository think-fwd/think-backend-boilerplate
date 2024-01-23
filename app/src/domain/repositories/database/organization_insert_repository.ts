import { OrganizationEntity } from '@domain/entities/organization_entity';
import { OrganizationStatusEnum } from '@domain/enums/organization_status_enum';

export type OrganizationInsertRepositoryProps = {
  data: Pick<OrganizationEntity, 'name' | 'document'> & {
    user_id: string;
    user_email: string;
    user_name: string;
    status: OrganizationStatusEnum;
  };
};

export interface IOrganizationInsertRepository {
  handle(props: OrganizationInsertRepositoryProps): Promise<OrganizationEntity>;
}
