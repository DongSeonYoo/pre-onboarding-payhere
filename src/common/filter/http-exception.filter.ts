import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { ResponseEntity } from '../dto/common-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(e: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    const statusCode = e.getStatus();
    const errorMessage = e.getResponse()['message'];

    res
      .status(statusCode)
      .json(ResponseEntity.ERROR_WITH(statusCode, errorMessage));
  }
}
