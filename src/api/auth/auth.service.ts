import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload } from './interface/access-payload.interface';
import env from 'src/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * accessToken and refresh token 리턴
   */
  async getAccessTokenAndRefreshToken(userId: number, email: string) {
    const accessToken = await this.generateAccessToken({ id: userId, email });
    const refreshToken = await this.generateRefreshToken({ id: userId });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: IAccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: env.jwt.access_secret,
      expiresIn: env.jwt.access_expires,
    });
  }

  // 리프레시 토큰 생성 시 데이터베이스에 저장
  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    const userId = payload.id;
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.jwt.refresh_secret,
      expiresIn: env.jwt.refresh_expires,
    });

    // 데이터베이스에 업데이트
    await this.userRepository.update(userId, {
      refreshToken,
    });

    return refreshToken;
  }

  async setRefreshToken(userId: number, refreshToken: string) {}
}
