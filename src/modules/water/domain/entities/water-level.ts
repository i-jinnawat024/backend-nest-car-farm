export class WaterLevel {
  private constructor(
    public readonly deviceId: string,
    public readonly level: number,
    public readonly recordedAt: Date | null,
    public readonly id: string | null,
  ) {}

  static create(deviceId: string, level: number): WaterLevel {
    if (!deviceId || deviceId.trim().length === 0) {
      throw new Error('deviceId is required');
    }

    if (!Number.isFinite(level)) {
      throw new Error('level must be a finite number');
    }

    return new WaterLevel(deviceId, level, null, null);
  }

  static rehydrate(params: {
    id: string;
    deviceId: string;
    level: number;
    recordedAt: Date;
  }): WaterLevel {
    return new WaterLevel(
      params.deviceId,
      params.level,
      params.recordedAt,
      params.id,
    );
  }

  withPersistence(id: string, recordedAt: Date): WaterLevel {
    return new WaterLevel(this.deviceId, this.level, recordedAt, id);
  }
}
