import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { getEnv } from 'src/global/config.global';
import { logger } from 'src/global/logger.global';
import { GlobalResponse } from 'src/global/response.global';

// TODO: rate limiting 처리
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionToPlain = instanceToPlain(exception);

    let responseData = GlobalResponse.exception({
      message: exceptionToPlain.message,
      statusCode: status,
    });

    if (status > 400 && status < 500) {
      if (getEnv<string>('NODE_ENV') === 'development') {
        logger.error(exception.stack);
      } else {
        logger.warn(
          `[${request.method}] ${exceptionToPlain.status} ► ${request.url} | ${exceptionToPlain.message}`,
        );
      }
    }

    if (status === 400) {
      logger.warn(
        `[${request.method}] ${exceptionToPlain.status} ► ${request.url} | ${exceptionToPlain.message}`,
      );

      responseData.statusCode = HttpStatus.BAD_REQUEST;
      responseData.message = '잘못된 요청입니다.';
    }

    if (status >= 500) {
      logger.error(
        `[${request.method}] ${exceptionToPlain.status} ► ${request.url} \n${exception.stack}`,
      );

      responseData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseData.message = '일시적인 오류가 발생하였습니다.';
    }

    if (exception.constructor.name === 'JsonWebTokenError') {
      responseData.statusCode = HttpStatus.UNAUTHORIZED;
      responseData.message = '로그인이 필요한 서비스입니다.';
    }

    response.status(status).json(responseData);
  }
}
