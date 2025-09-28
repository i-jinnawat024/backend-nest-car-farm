import { Module } from '@nestjs/common';
import { WaterController } from './water.controller';

@Module({
  imports: [],
  controllers: [WaterController],
  providers: [],
})
export class WaterModule {}
