import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    response.status(status).json({
      status: 'FAILURE',
      statusCode: status,
      message:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : 'Internal server error',
      errorCode:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).errorCode || 'INTERNAL_SERVER_ERROR'
          : 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
