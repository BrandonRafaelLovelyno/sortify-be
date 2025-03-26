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
      success: false,
      statusCode: status,
      message: this.parseErrorMessage(message),
      timestamp: new Date().toISOString(),
    });
  }

  parseErrorMessage(message: string | { message?: string }): string {
    let parsedMessage = 'something went wrong';

    console.log('message', message);

    if (typeof message === 'string') {
      parsedMessage = message;
    } else if (
      typeof message === 'object' &&
      'message' in message &&
      typeof message.message === 'string'
    ) {
      parsedMessage = message.message;
    }

    return parsedMessage;
  }
}
