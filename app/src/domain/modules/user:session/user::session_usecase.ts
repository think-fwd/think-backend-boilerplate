import { UserSessionDto } from './user::session_dto';

export class UserSessionUsecase {
  async handle(props: UserSessionDto) {
    return props.user;
  }
}
