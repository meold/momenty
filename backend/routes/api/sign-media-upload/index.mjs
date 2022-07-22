import { randomUUID } from 'crypto';
import Constants from '../../../helpers/Constants.mjs';

export default async function routes(instance) {
  instance.post(
    '/image/',

    {
      schema: {
        body: {
          properties: {
            extension: {
              type: 'string'
            }
          },
          required: ['extension']
        }
      }
    },

    async (request) => {
      const id = randomUUID();

      const url = await instance.s3.getSignedUrlPut({
        bucket: process.env.S3_BUCKET_INCOMING_MEDIA,
        filename: id + '.' + request.body.extension,
        contentType: 'application/octet-stream',
        acl: 'public-read', //FIXME

        expiresIn: Constants.IMAGE_SIGNED_UPLOAD_EXPIRES_IN_SECONDS
      });

      return {
        success: true,
        id,
        url
      };
    }
  );

  instance.post(
    '/video/',

    {
      schema: {
        body: {
          properties: {
            extension: {
              type: 'string'
            }
          },
          required: ['extension']
        }
      }
    },

    async (request) => {
      const id = randomUUID();

      const url = await instance.s3.getSignedUrlPut({
        bucket: process.env.S3_BUCKET_INCOMING_MEDIA,
        filename: id + '.' + request.body.extension,
        contentType: 'application/octet-stream',
        acl: 'public-read', //FIXME

        expiresIn: Constants.VIDEO_SIGNED_UPLOAD_EXPIRES_IN_SECONDS
      });

      return {
        success: true,
        id,
        url
      };
    }
  );
}
