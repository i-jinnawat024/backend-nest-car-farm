import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/events')
export class WaterController {
  @Post('water-level')
  async ingest(@Body() Body: { latest: string; deviceId: string }) {
    const { latest, deviceId } = Body;
    return { ok: true };
  }
  @Get('water-level/latest')
  async latestStatus() {
    return '10' as string;
  }
}
