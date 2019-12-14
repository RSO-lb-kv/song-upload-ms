import { Controller, Get } from '@nestjs/common';

import { DemoHealthIndicator } from './demo-health-indicator.service';

@Controller('health')
export class HealthController {
  constructor(private readonly demoHealth: DemoHealthIndicator) {}

  @Get('break')
  break() {
    this.demoHealth.breakMicroservice();
    return true;
  }
}
