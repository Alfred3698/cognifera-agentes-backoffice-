import { HttpModule, Module } from '@nestjs/common';

import { LoggerModule } from '@b-accel-logger/index';
import { DBModule } from '../db-module/module';
import { ArchivoService } from './archivo.service';
import { ArchivoController } from './archivo.controller';
import { AWSS3Bucket } from '../aws-s3-bucket/aws-s3-bucket.module';
/**
 *
 */
@Module({
  imports: [
    DBModule,
    HttpModule,
    LoggerModule.forRoot({ context: 'Archivo module' }),
    AWSS3Bucket.register({
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_FILES_BUCKET_NAME,
    }),
  ],
  controllers: [ArchivoController],
  providers: [ArchivoService],
  exports: [],
})
export class ArchivoModule {}
