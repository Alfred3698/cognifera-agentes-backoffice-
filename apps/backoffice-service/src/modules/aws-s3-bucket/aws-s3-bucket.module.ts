import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@b-accel-logger/index';
import { AwsOptions } from './aws-s3-bucket.types';
import { AWSS3BucketService } from './aws-s3-bucket.service';

@Module({})
export class AWSS3Bucket {
  static register(awsOptions: AwsOptions): DynamicModule {
    return {
      module: AWSS3Bucket,
      imports: [LoggerModule.forRoot({ context: 'AWS S3 Bucket' })],
      providers: [
        {
          provide: 'AWS_OPTIONS',
          useValue: awsOptions,
        },
        AWSS3BucketService,
      ],
      exports: [AWSS3BucketService],
    };
  }
}
