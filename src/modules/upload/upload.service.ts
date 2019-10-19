import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createHash } from 'crypto';
import { Response } from 'express';
import { extname } from 'path';

import { File } from '../../models/interfaces/file.interface';

function randomSHA1Hash() {
  return createHash('sha1')
    .update(Date.now() + '' + Math.random())
    .digest('hex');
}

@Injectable()
export class UploadService {
  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
  });

  saveUpload(file: File, res: Response) {
    if (!file) {
      throw new BadRequestException('File is missing.');
    }

    const uploadStream = this.s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
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
