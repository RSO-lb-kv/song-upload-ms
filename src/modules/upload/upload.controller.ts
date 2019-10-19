import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { File } from '../../models/interfaces/file.interface';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: File) {
    return this.uploadService.saveUpload(file);
  }
}
