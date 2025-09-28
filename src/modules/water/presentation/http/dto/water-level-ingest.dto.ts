import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class WaterLevelIngestDto {
  @IsString()
  readonly deviceId!: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true" || value === "1" || value === 1) {
      return true;
    }

    if (value === "false" || value === "0" || value === 0) {
      return false;
    }

    return value;
  })
  readonly waterReached!: boolean;

  @IsOptional()
  @IsString()
  readonly uptime_ms?: string;
}