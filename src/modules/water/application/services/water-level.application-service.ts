import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { WaterLevel } from "../../domain/entities/water-level";
import {
  WATER_LEVEL_REPOSITORY,
  WaterLevelRepository,
} from "../../domain/repositories/water-level.repository";

interface RecordWaterLevelPayload {
  deviceId: string;
  waterReached: boolean;
  uptime_ms?: string;
}

@Injectable()
export class WaterLevelApplicationService {
  constructor(
    @Inject(WATER_LEVEL_REPOSITORY)
    private readonly waterLevelRepository: WaterLevelRepository,
  ) {}

  async recordWaterLevel(payload: RecordWaterLevelPayload) {
    const level = payload.waterReached ? 1 : 0;

    if (!Number.isFinite(level)) {
      throw new BadRequestException("waterReached must be convertible to a numeric level");
    }

    try {
      const waterLevel = WaterLevel.create(payload.deviceId, level);
      return this.waterLevelRepository.save(waterLevel);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getLatest(deviceId: string) {
    return this.waterLevelRepository.findLatest(deviceId);
  }

  async getLatestAll() {
    return this.waterLevelRepository.findLatestAll();
  }
}