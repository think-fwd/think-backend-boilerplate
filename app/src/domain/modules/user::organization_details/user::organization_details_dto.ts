import { PaginationProps } from '@domain/utils/pagination/dto';

export type UserOrganizationDetailsDto = PaginationProps & {
  match: { organization_id: string };
};
