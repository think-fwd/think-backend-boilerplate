import { PaginationProps } from '@domain/utils/pagination/dto';

export type UserOrganizationFindDto = PaginationProps & {
  match: { user_id: string };
};
