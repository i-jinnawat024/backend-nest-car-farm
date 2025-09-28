import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WaterLevelApplicationService } from "./application/services/water-level.application-service";
import { WATER_LEVEL_REPOSITORY } from "./domain/repositories/water-level.repository";
import { WaterLevelOrmEntity } from "./infrastructure/persistence/typeorm/entities/water-level.orm-entity";
import { WaterLevelTypeOrmRepository } from "./infrastructure/persistence/typeorm/repositories/water-level.typeorm-repository";
import { WaterHttpController } from "./presentation/http/water.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WaterLevelOrmEntity])],
  controllers: [WaterHttpController],
  providers: [
    WaterLevelApplicationService,
    {
      provide: WATER_LEVEL_REPOSITORY,
      useClass: WaterLevelTypeOrmRepository,
    },
  ],
})
export class WaterModule {}