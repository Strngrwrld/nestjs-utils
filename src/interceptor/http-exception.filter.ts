import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { WinstonService } from 'nestjs-logger/dist';
import { BadRequest, NotFound, OK, TimeOut } from 'enum/response-status.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerWinston = new WinstonService()) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const exceptionResponse = JSON.parse(
      JSON.stringify(exception.getResponse()),
    );
    let customResponse;

    console.log(request);

    const logSchema = {
      contextMap: {
        product: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
        dd: {
          span_id: request.headers['x-span-id'], //JSON.stringify(context),
          trace_id: `erm-bff-employee-rest-${uuidv4()}`,
        },
      },
      loggerName: exceptionResponse.serviceName,
      message: exception.message,
    };

    this.loggerWinston.error(logSchema);

    switch (statusCode) {
      case 200:
        customResponse = OK;
        break;
      case 400:
        customResponse = BadRequest;
        break;
      case 404:
        customResponse = NotFound;
        break;

      case 408:
        customResponse = TimeOut;
        break;
      default:
        customResponse = {
          code: statusCode,
          message: exception.message,
        };
        break;
    }

    response.status(statusCode).json({ ...customResponse });
  }
}
