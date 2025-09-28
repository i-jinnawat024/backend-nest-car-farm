import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterLevel } from '../../../../domain/entities/water-level';
import { WaterLevelRepository } from '../../../../domain/repositories/water-level.repository';
import { WaterLevelOrmEntity } from '../entities/water-level.orm-entity';

@Injectable()
export class WaterLevelTypeOrmRepository implements WaterLevelRepository {
  constructor(
    @InjectRepository(WaterLevelOrmEntity)
    private readonly repository: Repository<WaterLevelOrmEntity>,
  ) {}

  async save(waterLevel: WaterLevel): Promise<WaterLevel> {
    const persisted = await this.repository.save(
      WaterLevelOrmEntity.fromDomain(waterLevel),
    );

    return persisted.toDomain();
  }

  async findLatest(deviceId?: string): Promise<WaterLevel | null> {
    const where = deviceId ? { deviceId } : {};
    const entity = await this.repository.findOne({
      where,
      order: { recordedAt: 'DESC' },
    });

    return entity ? entity.toDomain() : null;
  }

  async findLatestAll(): Promise<WaterLevel[]> {
    const entities = await this.repository.find({
      order: { recordedAt: 'DESC' },
    });

    return entities.map((entity) => entity.toDomain());
  }
}
