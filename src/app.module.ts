import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WaterModule } from './modules/water/water.module';

@Module({
  imports: [WaterModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
