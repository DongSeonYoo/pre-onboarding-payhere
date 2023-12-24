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
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { JwtRefreshGurad } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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
  @UseGuards(JwtAccessGuard)
  async getUser(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.userService.findUserByIdx(userId);
  }

  // header에 refresh token을 가지고 accessToken을 재발급해준다 (리턴해준다)
  @Post('/refresh')
  @UseGuards(JwtRefreshGurad)
  async refreshAccessToken(
    @Res({ passthrough: true }) res: Response,
    @UserDecorator() user: UserEntity,
  ) {
    const userId = user.id;
    const recivedRefreshToken = user.refreshToken;

    const { accessToken, refreshToken } = await this.authService.rotateToken(
      userId,
      recivedRefreshToken,
    );

    res.cookie('access_token', accessToken);
    res.cookie('refresh_token', refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  logout(@UserDecorator() user: UserEntity) {
    const userId = user.id;
    return this.authService.remomveRefreshToken(userId);
  }
}
