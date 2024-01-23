import { OrganizationEntity } from '@domain/entities/organization_entity';
import { PaginationProps } from '@domain/utils/pagination/dto';
import { PaginationType } from '@domain/utils/pagination/types';

export type OrganizationFindRepositoryProps = PaginationProps & {
  match?: {
    id?: string[] | string;
    user_id?: string;
  };
};

export interface IOrganizationFindRepository {
  handle(
    props: OrganizationFindRepositoryProps,
  ): Promise<PaginationType<OrganizationEntity> | OrganizationEntity[]>;
}
