export enum RepositoryProviderEnum {
  bitbucket = 'bitbucket',
  gitlab = 'gitlab',
  github = 'github',
}

export type RepositoryProviderEnumKeys = keyof typeof RepositoryProviderEnum;
