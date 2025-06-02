import { ListObjectsV2Request, ObjectList } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';

export class AwsOptions {
  region: string;
  bucket: string;
  kmsKey?: string;
  path?: string;
}

export class UploadFile {
  readeble: Readable;
  fileName: string;
}

export class ListObjectsKeys {
  maxKeys?: number;
  prefix?: string;
  bucket?: string;
}

export class GetObjectsKeys {
  listKeys: ObjectList;
  options: ListObjectsV2Request;
}

export class GetFileV2 {
  key: string;
  versionId?: string;
  bucket?: string;
}
