import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';

export class ResponseEntity<T> {
  @Expose()
  statusCode: HttpStatus;

  @Expose()
  message: string;

  @Expose()
  data: T;

  private constructor(status: HttpStatus, message: string, data: T) {
    this.statusCode = status;
    this.message = message;
    this.data = data;
  }

  static OK(
    message?: string,
    httpStatus: HttpStatus = HttpStatus.OK,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(httpStatus, message, '');
  }

  static OK_WITH<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, '', data);
  }

  static ERROR(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '서버 에러가 발생하였습니다',
      '',
    );
  }

  static ERROR_WITH(
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(code, message, '');
  }
}
