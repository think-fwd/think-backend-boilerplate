export type OAuthResponseType = {
  access_token: string;
  refresh_token: string | undefined;
  access_token_exp: number | undefined;
};
