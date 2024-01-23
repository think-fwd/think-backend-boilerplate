export type OrganizationUpdateAccountRepositoryProps = {
  organization_id: string;
  kind: 'scrum' | 'repository';
  status: 'connected' | 'expired';
  access_token: string;
  refresh_token?: string;
  access_token_exp?: number | undefined;
};

export interface IOrganizationUpdateAccountRepository {
  handle(props: OrganizationUpdateAccountRepositoryProps): Promise<void>;
}
