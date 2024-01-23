import { BucketAcl } from '@domain/repositories/storage/storage_repository';

export type SystemUploadFileDto = {
  image: string;
  moveFileTo: string;
  moveFileAcl: BucketAcl;
};
