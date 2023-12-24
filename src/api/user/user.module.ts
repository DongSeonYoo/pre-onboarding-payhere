import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { JwtAccessTokenStrategy } from '../auth/strategy/jwt-access.strategy';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtRefreshStrategy } from '../auth/strategy/jwt-refresh.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HashingModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtAccessTokenStrategy, JwtRefreshStrategy],
})
export class UserModule {}
