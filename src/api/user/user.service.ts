import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { HashingService } from 'src/common/hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly hashingService: HashingService,

    private readonly authService: AuthService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { password } = signupDto;

    const hashedPassword = await this.hashingService.hash(password);
    const user = signupDto.toEntity(hashedPassword);

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
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
    return this.userRepository.findOne({
      where: {
        id: userIdx,
      },
    });
  }
}
