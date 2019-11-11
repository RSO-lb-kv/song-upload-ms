import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { ConfigModule } from '@nestcloud/config';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { Module } from '@nestjs/common';
import { resolve } from 'path';

import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    BootModule.register(resolve(), 'consul.yml'),
    ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    ServiceModule.register({ dependencies: [NEST_BOOT] }),
  ],
})
export class AppModule {}
