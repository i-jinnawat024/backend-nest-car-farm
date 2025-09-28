import { Body, Controller, Get, NotFoundException, Post, Query } from "@nestjs/common";
import { WaterLevelApplicationService } from "../../application/services/water-level.application-service";
import { WaterLevelIngestDto } from "./dto/water-level-ingest.dto";

@Controller("api/events")
export class WaterHttpController {
  constructor(
    private readonly waterLevelApplicationService: WaterLevelApplicationService,
  ) {}

  @Post("water-level")
  async ingest(@Body() body: WaterLevelIngestDto) {
    await this.waterLevelApplicationService.recordWaterLevel(body);
    return { ok: true };
  }

  @Get("water-level/latest")
  async latestStatus(@Query("deviceId") deviceId: string) {
    const record = await this.waterLevelApplicationService.getLatest(deviceId);

    if (!record) {
      throw new NotFoundException("No water level readings recorded yet");
    }

    return {
      deviceId: record.deviceId,
      latest: record.level,
      recordedAt: record.recordedAt?.toISOString(),
    };
  }

  @Get("water-level/latest-all")
  async latestStatusAll() {
    return this.waterLevelApplicationService.getLatestAll();
  }
}