import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { ConfigModule } from '@nestcloud/config';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { resolve } from 'path';

import { ExternalModule } from './modules/external/external.module';
import { HealthModule } from './modules/health/health.module';
import { TerminusService } from './modules/health/terminus.service';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    BootModule.register(
      resolve(),
      process.env.DEVELOPMENT === 'true' ? 'consul-dev.yml' : 'consul.yml',
    ),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    TerminusModule.forRootAsync({
      imports: [HealthModule],
      useClass: TerminusService,
    }),
    ExternalModule,
  ],
})
export class AppModule {}
