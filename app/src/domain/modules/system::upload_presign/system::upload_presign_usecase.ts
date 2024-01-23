import { v4 } from 'uuid';
import {
  MissingPropsError,
  ErrorFilePresignUrlGeneration,
} from '@domain/i18n/messages';
import { validate } from '@domain/utils/validate';
import { SystemUploadPresignDto } from './system::upload_presign_dto';
import { SystemUploadPresignValidator } from './system::upload_presign_validator';
import {
  IStorageRepository,
  PresignedPostType,
} from '@domain/repositories/storage/storage_repository';

export class SystemUploadPresignUsecase {
  constructor(private readonly uploadRepository: IStorageRepository) {}

  public handle = async (
    props: SystemUploadPresignDto,
  ): Promise<PresignedPostType> => {
    // throw error if usecase caller
    // does not provide any required props
    if (!props || Object.keys(props).length === 0)
      throw new MissingPropsError();

    // validate content data to prevent
    // native errors from database
    await validate(props, SystemUploadPresignValidator);

    // generate document key using uuidv4
    const document_key = v4();

    // create presigned url on aws sdk
    const presignedPost = await this.uploadRepository.createPresignedUpload({
      acl: 'private',
      filename: `tmp/${document_key}.${props.extension}`,
    });

    // throw an error if was not possible to create presigned url
    if (!presignedPost) {
      throw new ErrorFilePresignUrlGeneration();
    }

    // return created database with presigned url
    return presignedPost;
  };
}
