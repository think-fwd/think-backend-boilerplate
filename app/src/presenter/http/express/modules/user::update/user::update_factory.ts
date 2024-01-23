import { S3 } from '@aws-sdk/client-s3';
import { AWSProvider } from '@data/aws';
import { mongoInstance } from '@data/database/mongodb';
import { S3StorageRepository } from '@data/storage/s3';
import { CognitoAuthRepository } from '@data/auth/cognito';
import { UserUpdateController } from './user::update_controller';
import { UserUpdateUsecase } from '@domain/modules/user:update/user::update_usecase';
import { SystemUploadFileUsecase } from '@domain/modules/system::upload_file/system::upload_file_usecase';
import { MongoMemberFindRepository } from '@data/database/mongodb/repositories/mongo_member_find_repository';
import { DateUtil } from '@domain/utils/date';

export const userUpdateFactory = () => {
  return new UserUpdateController(
    new UserUpdateUsecase(
      new CognitoAuthRepository(),
      new SystemUploadFileUsecase(
        new S3StorageRepository(new S3(new AWSProvider().buildConfig())),
      ),
      new MongoMemberFindRepository(new DateUtil(), mongoInstance),
    ),
  );
};
