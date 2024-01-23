import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { FileMetadataType } from '@domain/types/file_metadata_type';
import { Readable } from 'node:stream';

export type BucketAcl = 'public-read' | 'private';

export type PresignedUrlProps = {
  filename: string;
  acl: BucketAcl;
};

export interface PresignedPostType {
  url: string;
  fields: Record<string, string>;
}

export interface IStorageRepository {
  createPresignedUpload(
    props: PresignedUrlProps,
  ): Promise<PresignedPostType | undefined>;
  generateSignedUrl(filename: string): Promise<string>;
  deleteFile(filename: string): Promise<boolean>;
  fileExists(filename: string): Promise<FileMetadataType | false>;
  readObject(filename: string): Promise<GetObjectCommandOutput | undefined>;
  putObject(
    key: string,
    acl: BucketAcl,
    buffer: Buffer | Readable,
  ): Promise<boolean>;
  moveFile(
    originFile: string,
    destinationFile: string,
    acl: BucketAcl,
  ): Promise<boolean>;
  streamPutObject(
    key: string,
    acl: BucketAcl,
    stream: Readable,
  ): Promise<boolean>;
}
