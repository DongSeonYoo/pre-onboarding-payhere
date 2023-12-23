import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

export const UserDecorator = createParamDecorator(
  (data, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);
