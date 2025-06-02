import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import { S3 } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/acm';
import {} from 'aws-sdk/clients/s3';
import { GetObjectRequest, PutObjectRequest } from '@aws-sdk/client-s3';
import { AwsOptions } from './aws-s3-bucket.types';
@Injectable()
export class AWSS3BucketService implements OnModuleInit {
  constructor(
    @Inject('AWS_OPTIONS') private readonly awsOptions: AwsOptions,
    private logger: Logger,
  ) {}

  awsClient: S3;

  getAWSClient(): S3 {
    return this.awsClient;
  }

  setAWSClient(): void {
    const options: ClientConfiguration = {
      apiVersion: '2006-03-01',
      region: this.awsOptions.region,
    };

    options.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    };

    this.awsClient = new S3(options);
  }

  async onModuleInit() {
    this.setAWSClient();
  }

  async uploadFile(file, path: string, fileName: string) {
    const fileKey = path + `/` + fileName;
    try {
      const options: PutObjectRequest = {
        Bucket: this.awsOptions.bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      return await this.getAWSClient().upload(options).promise();
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async downloadFile(fileKey) {
    try {
      const options: GetObjectRequest = {
        Bucket: this.awsOptions.bucket,
        Key: fileKey,
      };
      return await this.getAWSClient().getObject(options).promise();
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async deleteFile(fileKey) {
    try {
      const options: GetObjectRequest = {
        Bucket: this.awsOptions.bucket,
        Key: fileKey,
      };
      return await this.getAWSClient().deleteObject(options).promise();
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
