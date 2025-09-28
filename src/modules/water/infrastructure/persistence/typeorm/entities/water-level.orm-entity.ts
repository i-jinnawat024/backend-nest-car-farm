import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WaterLevel } from '../../../../domain/entities/water-level';

const numericTransformer = {
  to: (value: number | null | undefined) => value ?? null,
  from: (value: string | null | undefined) =>
    value === null || value === undefined ? null : Number(value),
};

@Entity({ name: 'water_levels' })
export class WaterLevelOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column({ type: 'numeric', transformer: numericTransformer })
  level: number;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt?: Date;

  static fromDomain(domain: WaterLevel): WaterLevelOrmEntity {
    const entity = new WaterLevelOrmEntity();
    entity.id = domain.id ?? undefined;
    entity.deviceId = domain.deviceId;
    entity.level = domain.level;
    entity.recordedAt = domain.recordedAt ?? undefined;
    return entity;
  }

  toDomain(): WaterLevel {
    if (!this.id || !this.recordedAt) {
      throw new Error('Persisted entity must have id and recordedAt');
    }

    return WaterLevel.rehydrate({
      id: this.id,
      deviceId: this.deviceId,
      level: this.level,
      recordedAt: this.recordedAt,
    });
  }
}
