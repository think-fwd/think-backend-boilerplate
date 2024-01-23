import { JwtUtil } from '@domain/utils/jwt';
import { AuthType } from '@domain/types/auth_type';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '@presenter/http/express/utils/handle_error';
import { IAuthRepository } from '@domain/repositories/auth/auth_repository';
import {
  MissingAuthorizationTokenFailure,
  UnauthorizedTokenFailure,
} from '@domain/i18n/messages';
import { IMemberFindRepository } from '@domain/repositories/database/member_find_repository';
import { MemberEntity } from '@domain/entities/member_entity';

export class IsAuthenticatedPolicy {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly authRepository: IAuthRepository,
    private readonly memberFindRepository: IMemberFindRepository,
  ) {}

  public handle = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      // const authorization =
      //   request.headers['authorization'] || request.headers['Authorization'];
      const authorization = request.cookies['Authorization'];
      if (!authorization) throw new MissingAuthorizationTokenFailure();

      const token = String(authorization).replace('Bearer ', '');

      if (!token) {
        throw new MissingAuthorizationTokenFailure();
      }

      const pem = await this.authRepository.generatePem();
      const jwtData = this.jwtUtil.decode(token);
      if (!jwtData?.header?.kid) throw new UnauthorizedTokenFailure();
      if (!jwtData?.header?.alg) throw new UnauthorizedTokenFailure();
      if (!pem[jwtData.header.kid]) throw new UnauthorizedTokenFailure();

      try {
        const payload = this.jwtUtil.verify(
          token,
          pem[jwtData.header.kid],
          jwtData.header.alg,
        ) as AuthType;
        request.auth = payload;
      } catch (error) {
        throw new UnauthorizedTokenFailure();
      }

      // attach user session to payload
      request.jwt = token;
      request.user = await this.authRepository.session(token);
      request.user.members = (await this.memberFindRepository.handle({
        match: { user_id: request.user.sub },
      })) as unknown as MemberEntity[];

      return next();
    } catch (error) {
      // console.log(error);
      return handleError(response, error as Record<string, unknown>);
    }
  };
}
