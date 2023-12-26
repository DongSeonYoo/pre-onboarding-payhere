import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
import { RequestLoginDto, RequestSignupDto } from './dto/request-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly hashingService: HashingService,

    private readonly authService: AuthService,
  ) {}

  async signup(signupDto: RequestSignupDto) {
    const { password } = signupDto;

    const hashedPassword = await this.hashingService.hash(password);
    const user = signupDto.toEntity(hashedPassword);

    return this.userRepository.save(user);
  }

  async login(loginDto: RequestLoginDto) {
    // 1. 해당하는 이메일을 가진 사용자가 있는지 확인
    const { email, password } = loginDto;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다');
    }

    // 2. 암호화된 비밀번호 compare
    const comparePassword = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다');
    }

    // 3. generate token
    return this.authService.getAccessTokenAndRefreshToken(user.id, user.email);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findUserByIdx(userIdx: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userIdx,
      },
    });

    if (!user) {
      throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
    }

    return user;
  }
}
