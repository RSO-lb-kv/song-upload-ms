import { ConsulConfig, InjectConfig } from '@nestcloud/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createHash } from 'crypto';
import { extname } from 'path';

import { File } from '../../models/interfaces/file.interface';
import { ExternalService } from '../external/external.service';

function randomSHA1Hash() {
  return createHash('sha1')
    .update(Date.now() + '' + Math.random())
    .digest('hex');
}

@Injectable()
export class UploadService {
  private s3: S3;

  constructor(
    @InjectConfig() private config: ConsulConfig,
    private externalService: ExternalService,
  ) {
    this.s3 = new S3(config.get('aws'));
    config.watch('aws', data => {
      console.log('DATA', data);
      this.s3 = new S3(data);
    });
  }

  saveUpload(file: File, songData) {
    if (!file) {
      throw new BadRequestException('File is missing.');
    }

    const uploadStream = this.s3.upload({
      Bucket: this.config.get('aws.bucket'),
      Key: randomSHA1Hash() + extname(file.originalname).toLowerCase(),
      ACL: 'public-read',
      Body: file.buffer,
    });

    process.nextTick(async () => {
      uploadStream.on('httpUploadProgress', evt => {
        // console.log(evt);
        // TODO: do something with upload progress
      });

      const response = await uploadStream.promise();

      const data: any = await this.externalService
        .put('tempo-detection', '/v1/tempo-detection', {
          url: response.Location,
        })
        .catch(() => {});

      await this.externalService.put(
        'music-catalog',
        `/v1/catalog/${songData.id}`,
        {
          bpm: data ? data.bpm : '',
          uri: response.Location,
          status: 'FINISHED',
        },
      );
    });
  }
}
