import mime from 'mime-types';
import { AWSProvider } from '@data/aws';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileMetadataType } from '@domain/types/file_metadata_type';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';

import {
  S3,
  GetObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';

import {
  BucketAcl,
  PresignedUrlProps,
  IStorageRepository,
} from '@domain/repositories/storage/storage_repository';
import { Readable } from 'node:stream';
import { Upload } from '@aws-sdk/lib-storage';

export class S3StorageRepository
  extends AWSProvider
  implements IStorageRepository
{
  constructor(private readonly s3: S3) {
    super();
  }

  async generateSignedUrl(filename: string): Promise<string> {
    return await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: filename,
      }),
      { expiresIn: 300 },
    );
  }

  async createPresignedUpload(
    props: PresignedUrlProps,
  ): Promise<PresignedPost | undefined> {
    try {
      const mimetype = mime.lookup(props.filename);
      if (!mimetype) throw new Error('mime not defined');
      return await createPresignedPost(this.s3, {
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: props.filename,
        Conditions: [
          { acl: props.acl },
          { bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME! },
          ['content-length-range', 0, 15 * 1024 * 1024],
          // ['starts-with', '$Content-Type', mimetype],
        ],
        Fields: { acl: props.acl },
        Expires: 300, // 300 sec / 5 min
      });
    } catch (error) {
      console.log(error.message);
      return undefined;
    }
  }

  async readObject(
    filename: string,
  ): Promise<GetObjectCommandOutput | undefined> {
    try {
      return this.s3.getObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: filename,
      });
    } catch (error) {
      console.log(error.message);
      return undefined;
    }
  }

  async fileExists(filename: string): Promise<FileMetadataType | false> {
    try {
      const metadata = await this.s3.headObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: filename,
      });
      return {
        name: filename,
        slug: filename,
        mime: mime.lookup(filename) || metadata.ContentType,
        size: metadata.ContentLength,
      };
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      // upload buffer to aws s3
      await this.s3.deleteObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: filename,
      });
      // return boolean to deleted
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async moveFile(
    originFileKey: string,
    destinationFileKey: string,
    acl: BucketAcl,
  ): Promise<boolean> {
    try {
      await this.s3.copyObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        CopySource: `${process.env
          .AWS_S3_UPLOAD_BUCKET_NAME!}/${originFileKey}`,
        Key: destinationFileKey,
        ACL: acl,
      });
      await this.s3.deleteObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: originFileKey,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async putObject(
    key: string,
    acl: BucketAcl,
    buffer: Buffer | Readable,
  ): Promise<boolean> {
    try {
      await this.s3.putObject({
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: key,
        ACL: acl,
        Body: buffer,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async streamPutObject(
    key: string,
    acl: BucketAcl,
    stream: Readable,
  ): Promise<boolean> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: process.env.AWS_S3_UPLOAD_BUCKET_NAME!,
        Key: key,
        ACL: acl,
        Body: stream,
      },
    });
    try {
      await upload.done();
      console.log('Upload successful!');
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  }
}
