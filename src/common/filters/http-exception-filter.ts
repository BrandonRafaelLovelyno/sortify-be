import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      message: this.parseErrorMessage(message),
    });
  }

  parseErrorMessage(
    message: string | { message?: string | string[] },
  ): string | string[] {
    let parsedMessage: string | string[] = 'something went wrong';

    if (typeof message === 'string') {
      parsedMessage = message;
    } else if (message?.message) {
      parsedMessage = message.message;
    }

    return parsedMessage;
  }
}
