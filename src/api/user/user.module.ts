import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guard/jwt-access.guard';
import { JwtAccessTokenStrategy } from '../auth/strategy/jwt-access.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HashingModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtAccessTokenStrategy],
})
export class UserModule {}
