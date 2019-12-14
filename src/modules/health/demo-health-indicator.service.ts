import { HealthCheckError } from '@godaddy/terminus';
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class DemoHealthIndicator extends HealthIndicator {
  private healthy = true;

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const result = this.getStatus(key, this.healthy);
    if (this.healthy) {
      return result;
    }
    throw new HealthCheckError('Health check failed', result);
  }

  breakMicroservice() {
    this.healthy = false;
  }
}
