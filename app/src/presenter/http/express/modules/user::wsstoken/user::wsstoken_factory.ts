import { UserWssTokenController } from './user::wsstoken_controller';
import { JwtUtil } from '@domain/utils/jwt';
export const userWssTokenFactory = () => {
  return new UserWssTokenController(new JwtUtil(process.env.WSS_TOKEN_SECRET!));
};
