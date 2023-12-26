import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { JwtRefreshGurad } from '../auth/guard/jwt-refresh.guard';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ResponseEntity } from 'src/common/dto/common-response.dto';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { ResponseUserProfileDto } from './dto/response-user.dto';
import { RequestLoginDto, RequestSignupDto } from './dto/request-user.dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() signupDto: RequestSignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: RequestLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.userService.login(loginDto);
    res.cookie('access_token', accessToken);
    res.cookie('refresh_token', refreshToken);

    return ResponseEntity.OK_WITH({ accessToken, refreshToken });
  }

  @Get('/:userId')
  @UseGuards(JwtAccessGuard)
  async getUser(@Param('userId', new ParseIntPipe()) userId: number) {
    const profile = await this.userService.findUserByIdx(userId);

    return ResponseEntity.OK_WITH(new ResponseUserProfileDto(profile));
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

    return ResponseEntity.OK_WITH({ accessToken, refreshToken });
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  async logout(
    @UserDecorator() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = user.id;

    // refresh token 삭제
    await this.authService.remomveRefreshToken(userId);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return ResponseEntity.OK('로그아웃 성공');
  }
}
