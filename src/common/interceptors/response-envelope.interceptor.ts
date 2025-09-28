import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

interface ResponseEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.isAlreadyEnveloped(data)) {
          return data;
        }

        const { message, payload } = this.extractMessageAndPayload(data);
        const envelope: ResponseEnvelope<unknown> = {
          success: true,
          data: payload,
        };

        if (message) {
          envelope.message = message;
        }

        return envelope;
      }),
    );
  }

  private isAlreadyEnveloped(value: unknown): value is ResponseEnvelope<unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      "success" in value &&
      "data" in value
    );
  }

  private extractMessageAndPayload(value: unknown) {
    if (
      typeof value === "object" &&
      value !== null &&
      "message" in value &&
      typeof (value as any).message === "string"
    ) {
      const { message, data, ...rest } = value as { message: string; data?: unknown } & Record<string, unknown>;

      if (data !== undefined) {
        return { message, payload: data };
      }

      return { message, payload: rest };
    }

    return { message: undefined, payload: value ?? null };
  }
}