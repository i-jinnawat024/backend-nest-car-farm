import { WaterLevel } from '../entities/water-level';

export const WATER_LEVEL_REPOSITORY = Symbol('WATER_LEVEL_REPOSITORY');

export interface WaterLevelRepository {
  save(waterLevel: WaterLevel): Promise<WaterLevel>;
  findLatest(deviceId?: string): Promise<WaterLevel | null>;
  findLatestAll(): Promise<WaterLevel[]>;
}
