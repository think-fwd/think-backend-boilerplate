import { S3 } from '@aws-sdk/client-s3';
import { AWSProvider } from '@data/aws';
import { S3StorageRepository } from '@data/storage/s3';
import { AppUploadController } from './app::upload_controller';
import { SystemUploadPresignUsecase } from '@domain/modules/system::upload_presign/system::upload_presign_usecase';

export const appUploadFactory = () => {
  return new AppUploadController(
    new SystemUploadPresignUsecase(
      new S3StorageRepository(new S3(new AWSProvider().buildConfig())),
    ),
  );
};
