// cloud-storage.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { ConfigType } from '@nestjs/config';
import gcsStorageConfig from './cloud-storage.config';

@Injectable()
export class CloudStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(
    @Inject(gcsStorageConfig.KEY)
    private readonly config: ConfigType<typeof gcsStorageConfig>,
  ) {
    // Values and secrets need to connect to cloud storage
    this.storage = new Storage({
      projectId: config.projectId,
      credentials: {
        client_email: config.client_email,
        private_key: config.private_key,
      },
    });
    this.bucketName = config.mediaBucket;
  }

  // Asynchronously stream image to cloud storage(bucket)
  async uploadFile(file: Express.Multer.File, postId: number) {
    const bucket = this.storage.bucket(this.bucketName);
    const blobName = `${postId}-${uuidv4()}-${file.originalname}`;

    const fileStream = Readable.from(file.buffer);
    const fileUpload = bucket.file(blobName).createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          postId, // pass the post id as metadata
        },
      },
    });

    fileStream
      .pipe(fileUpload)
      .on('progress', (progress) => {
        console.log(`Progress: ${JSON.stringify(progress)}`);
      })
      .on('finish', () => {
        console.log('File uploaded successfully.');
      })
      .on('error', (err) => {
        console.log(`Error: ${err}`);
      });
  }
}
