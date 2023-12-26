import { UserEntity } from 'src/entities/user.entity';

export class ResponseUserProfileDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
