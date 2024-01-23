export type UserResetPasswordDto = {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
};
