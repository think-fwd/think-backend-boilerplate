import _ from 'lodash';
import https from 'https';
import { MimedBufferType } from '@domain/types/mimed_buffer_type';

export class DownloadUtil {
  async download(url: string): Promise<MimedBufferType> {
    return new Promise((resolve, reject) => {
      const data: Uint8Array[] = [];
      https.get(url, res => {
        res.on('data', (chunk: Uint8Array) => data.push(chunk));
        res.on('end', () =>
          resolve({
            contentType: _.get(
              res,
              'headers.content-type',
              'application/octet-stream',
            ),
            buffer: Buffer.concat(data),
          }),
        );
        res.on('error', err => reject(err));
      });
    });
  }
}
