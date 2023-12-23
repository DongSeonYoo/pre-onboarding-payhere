import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(plainPassword: string): Promise<string> {
    const salt = 10;

    return bcrypt.hash(plainPassword, salt);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
