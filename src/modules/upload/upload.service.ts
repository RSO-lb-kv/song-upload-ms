import { ConsulConfig, InjectConfig } from '@nestcloud/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createHash } from 'crypto';
import { extname } from 'path';

import { File } from '../../models/interfaces/file.interface';

function randomSHA1Hash() {
  return createHash('sha1')
    .update(Date.now() + '' + Math.random())
    .digest('hex');
}

@Injectable()
export class UploadService {
  private s3: S3;

  constructor(@InjectConfig() private config: ConsulConfig) {
    config.watch('aws', data => {
      this.s3 = new S3(data);
    });
  }

  saveUpload(file: File) {
    if (!file) {
      throw new BadRequestException('File is missing.');
    }

    const uploadStream = this.s3.upload({
      Bucket: this.config.get('aws.bucket'),
      Key: randomSHA1Hash() + extname(file.originalname).toLowerCase(),
      ACL: 'public-read',
      Body: file.buffer,
      //ContentType: mimeType.contentType(extname(file.key)),
    });

    process.nextTick(async () => {
      uploadStream.on('httpUploadProgress', evt => {
        console.log(evt);
        // TODO: do something with upload progress
      });

      const response = await uploadStream.promise();
      console.log(response);

      //TODO: send data to catalog-MS
    });

    return { status: 'File upload started' };
  }
}
