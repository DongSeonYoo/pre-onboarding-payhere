import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import env from 'src/config/env.config';
import { HashingModule } from 'src/common/hashing/hashing.module';

@Module({
  imports: [HashingModule],
  exports: [AuthService],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
