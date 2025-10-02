import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus()
    const errorResponse = exception.getResponse()

    // console.log("FILTER RUNNER.......................................")

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: errorResponse !== "" ? errorResponse : 'Erro Genérico',
      path: request.url
    });
  }
}