import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): void;
}

interface HttpRequest {
  url: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();
    const request = ctx.getRequest<HttpRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erro interno no servidor.';
    let error = 'Internal Server Error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name.replace(/Exception$/, '');
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as Record<string, unknown>;
        message = (payload.message as string | string[]) || exception.message;
        error = (payload.error as string) || exception.name.replace(/Exception$/, '');
        code = (payload.code as string) || (payload.error as string) || exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
