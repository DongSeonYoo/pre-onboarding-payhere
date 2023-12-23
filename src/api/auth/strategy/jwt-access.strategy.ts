import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import env from 'src/config/env.config';
import { IAccessTokenPayload } from '../interface/access-payload.interface';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class JwtAccessTokenGuard extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      JwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.jwt.access_secret,
    });
  }

  async validate(payload: IAccessTokenPayload) {
    return this.userService.findUserByIdx(payload.id);
  }
}
