import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAccessTokenStrategy } from '../auth/strategy/jwt-access.strategy';
import { JwtAuthGuard } from '../auth/guard/jwt-access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.userService.login(loginDto);
    res.cookie('access_token', accessToken);
    res.cookie('refresh_token', refreshToken);

    res.send({ accessToken, refreshToken });
  }

  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.userService.findUserByIdx(userId);
  }
}
