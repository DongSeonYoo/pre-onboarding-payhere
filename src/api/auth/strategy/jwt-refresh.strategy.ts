import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/api/user/user.service';
import env from 'src/config/env.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refresh_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.jwt.refresh_secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IRefreshTokenPayload) {
    const refreshToken = req.cookies['refresh_token'];

    return { refreshToken, id: payload.id };
  }
}
