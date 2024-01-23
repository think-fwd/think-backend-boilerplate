import moment from 'moment-timezone';
import jwt, { Algorithm, Jwt } from 'jsonwebtoken';
import { UnauthorizedTokenFailure } from '@domain/i18n/messages';

type SignOptionsType = {
  dynamicSecret?: string;
  expireInDays?: number;
  payload: Record<string, unknown>;
};

export class JwtUtil {
  constructor(private readonly jwt_secret?: string) {}

  decode(bearerToken: string): Jwt | null {
    return jwt.decode(bearerToken.replace('Bearer ', ''), {
      complete: true,
    }) as Jwt;
  }

  sign(
    sub: number | string,
    email: string,
    audience: string,
    options?: SignOptionsType,
  ): string {
    return jwt.sign(
      {
        sub: String(sub),
        email: email,
        aud: audience,
        exp: Math.floor(
          moment(new Date())
            .add(options?.expireInDays || 30, 'days')
            .toDate()
            .getTime() / 1000,
        ),
        data: options?.payload || {},
      },
      options?.dynamicSecret || this.jwt_secret!,
    );
  }

  verify(
    token: string,
    dinamicSecret: string,
    dynamicAlgorithm?: string,
  ): string | jwt.JwtPayload {
    try {
      // remove bearer string from token if it exists
      let treatedToken = token;
      if (treatedToken.startsWith('Bearer '))
        treatedToken = treatedToken.replace('Bearer ', '');
      return jwt.verify(treatedToken, dinamicSecret, {
        algorithms: dynamicAlgorithm
          ? [dynamicAlgorithm as Algorithm]
          : ['HS256'],
      });
    } catch (error) {
      throw new UnauthorizedTokenFailure();
    }
  }
}
