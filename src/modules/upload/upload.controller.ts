import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { File } from '../../models/interfaces/file.interface';
import { ExternalService } from '../external/external.service';
import { VSong } from './song.validation';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private externalService: ExternalService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: File, @Body() data: VSong) {
    const songData = await this.externalService.post<{ id: number }>(
      'music-catalog',
      '/v1/catalog',
      data,
    );
    this.uploadService.saveUpload(file, songData);
    return songData;
  }
}
