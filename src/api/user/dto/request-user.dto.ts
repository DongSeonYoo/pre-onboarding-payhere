import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';

export class RequestLoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RequestSignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/, {
    message:
      '비밀번호는 문자, 숫자, 특수문자가 최소 1개 이상 포함되며 8자리에서 최대 16자리 문자열입니다.',
  })
  password: string;

  toEntity(hashedPassword: string) {
    const user = new UserEntity();

    user.email = this.email;
    user.password = hashedPassword;
    return user;
  }
}
