import { ErrorFileNotUploaded } from '@domain/i18n/messages';
import { SystemUploadFileDto } from './system::upload_file_dto';
import { FileMetadataType } from '@domain/types/file_metadata_type';
import { IStorageRepository } from '@domain/repositories/storage/storage_repository';

export class SystemUploadFileUsecase {
  constructor(private readonly storageRepository: IStorageRepository) {}

  public handle = async (
    props: SystemUploadFileDto,
  ): Promise<string | undefined> => {
    // define nulled file to be filled if props.file provided
    let file: FileMetadataType | undefined = undefined;

    // check if provided file, matches with user expectd credentials
    const filename = props.image?.split?.('::')?.slice?.(-1)?.[0];
    const extension = filename?.split?.('.')?.slice?.(-1)?.[0];

    // check if file was uploaded
    const uploadedFileMetadata = await this.storageRepository.fileExists(
      props.image,
    );
    if (!uploadedFileMetadata) {
      throw new ErrorFileNotUploaded();
    }
    // move file from tmp uploads to notes permanent folder
    file = {
      name: props.moveFileTo,
      slug: `${props.moveFileTo}.${extension}`,
      mime: uploadedFileMetadata.mime,
      size: uploadedFileMetadata.size,
    };

    const moved = await this.storageRepository.moveFile(
      props.image,
      file.name,
      props.moveFileAcl,
    );

    // update payload with url if moved currectly
    if (moved) {
      return [
        process.env.AWS_S3_DOMAIN,
        process.env.AWS_S3_UPLOAD_BUCKET_NAME,
        [file.name, new Date().getTime()].join('?v='),
      ].join('/');
    }

    return undefined;
  };
}
