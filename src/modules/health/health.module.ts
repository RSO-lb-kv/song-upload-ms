import { Module } from '@nestjs/common';

import { DemoHealthIndicator } from './demo-health-indicator.service';
import { HealthController } from './health.controller';

@Module({
  providers: [DemoHealthIndicator],
  exports: [DemoHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
