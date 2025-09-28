import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ObserveInterceptor } from "./common/interceptors/observe.interceptor";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor";
import { WaterModule } from "./modules/water/water.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const synchronize =
          (process.env.TYPEORM_SYNCHRONIZE ?? "true").toLowerCase() === "true";
        const useSsl =
          (process.env.DATABASE_SSL ?? "false").toLowerCase() === "true";

        if (process.env.DATABASE_URL) {
          return {
            type: "postgres" as const,
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize,
            ssl: useSsl ? { rejectUnauthorized: false } : undefined,
          };
        }

        return {
          type: "postgres" as const,
          host: process.env.DATABASE_HOST ?? "localhost",
          port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
          username: process.env.DATABASE_USERNAME ?? "postgres",
          password: process.env.DATABASE_PASSWORD ?? "postgres",
          database: process.env.DATABASE_NAME ?? "postgres",
          autoLoadEntities: true,
          synchronize,
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),
    WaterModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ObserveInterceptor,
    },
  ],
})
export class AppModule {}