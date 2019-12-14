import { Module } from '@nestjs/common';

import { ExternalModule } from '../external/external.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [ExternalModule],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
