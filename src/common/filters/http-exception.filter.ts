import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message, data } = this.normalizeException(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const trace = exception instanceof Error ? exception.stack : undefined;
      const description = exception instanceof Error ? exception.message : String(exception);
      this.logger.error(description, trace);
    }

    response.status(status).json({
      success: false,
      message,
      data,
    });
  }

  private normalizeException(exception: unknown) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === "string") {
        return {
          status,
          message: response,
          data: null,
        };
      }

      if (typeof response === "object" && response) {
        const body = response as Record<string, unknown>;
        const message = this.extractMessage(body);
        const data = this.extractData(body);

        return {
          status,
          message,
          data,
        };
      }

      return {
        status,
        message: exception.message,
        data: null,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: null,
    };
  }

  private extractMessage(body: Record<string, unknown>): string {
    const { message, error } = body;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    if (typeof error === "string" && error.trim().length > 0) {
      return error;
    }

    return "Request failed";
  }

  private extractData(body: Record<string, unknown>) {
    if ("data" in body) {
      return body.data;
    }

    if (Array.isArray(body.message)) {
      return body.message;
    }

    return null;
  }
}