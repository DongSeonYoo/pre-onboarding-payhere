import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IAccessTokenPayload } from './interface/access-payload.interface';
import env from 'src/config/env.config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * accessToken and refresh token 리턴
   */
  async getAccessTokenAndRefreshToken(
    userId: number,
    email: string,
  ): Promise<string> {
    return this.generateAccessToken({ id: userId, email });
  }

  async generateAccessToken(payload: IAccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: env.jwt.access_secret,
      expiresIn: env.jwt.access_expires,
    });
  }

  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.jwt.refresh_secret,
      expiresIn: env.jwt.refresh_expires,
    });

    return refreshToken;
  }

  async setRefreshToken(userId: number, refreshToken: string) {}
}
