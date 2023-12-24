import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenPayload } from './interface/access-payload.interface';
import env from 'src/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * accessToken and refresh token 리턴
   */
  async getAccessTokenAndRefreshToken(userId: number, email: string) {
    const accessToken = await this.generateAccessToken({ id: userId, email });
    const refreshToken = await this.generateRefreshToken({ id: userId });

    // 데이터베이스에 refresh token 업데이트
    await this.setRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  // 액세스 토큰 생성
  async generateAccessToken(payload: IAccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: env.jwt.access_secret,
      expiresIn: env.jwt.access_expires,
    });
  }

  // 리프레시 토큰 생성
  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.jwt.refresh_secret,
      expiresIn: env.jwt.refresh_expires,
    });

    return refreshToken;
  }

  // 리프레시 토큰을 데이터베이스에 저장
  async setRefreshToken(userId: number, refreshToken: string) {
    return this.userRepository.update(userId, {
      refreshToken,
    });
  }

  // 리프레시 토큰을 받아 액세스 토큰을 재발급한다
  async rotateToken(userId: number, recivedRefreshToken: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    // 1. 저장된 refresh token이 없을 떄
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('인증 실패');
    }

    // 2. 저장된 refresh token이 유효하지 않을 때
    // -> 이건 근데 이미 refresh guard에서 이미 검증 했기 때문에 저장된 refresh token과 동일하면 검증도 통과함

    // 3. 받은 refresh token과 저장된 refresh token과 일치하지 않을 때
    if (recivedRefreshToken !== user.refreshToken) {
      throw new UnauthorizedException('인증 실패');
    }

    const { accessToken, refreshToken } =
      await this.getAccessTokenAndRefreshToken(user.id, user.email);

    // 4. 새로 발급 한 refresh token을 데이터베이스에 저장
    await this.setRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async remomveRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      refreshToken: null,
    });
  }
}
