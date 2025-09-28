import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class ObserveInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ObserveInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startedAt = Date.now();

    this.logger.log(`Processing ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => this.logger.log(`Completed ${method} ${url} in ${Date.now() - startedAt}ms`),
        error: (error) =>
          this.logger.error(
            `Failed ${method} ${url} after ${Date.now() - startedAt}ms: ${error?.message ?? error}`,
          ),
      }),
    );
  }
}