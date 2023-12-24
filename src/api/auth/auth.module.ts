import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HashingModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [AuthService],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
