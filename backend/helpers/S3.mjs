import { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { S3RequestPresigner, getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createRequest } from '@aws-sdk/util-create-request';
import { formatUrl } from '@aws-sdk/util-format-url';
import fs from 'fs';
import os from 'os';
import path from 'path';
import mimeTypes from 'mime-types';
import { randomUUID } from 'crypto';

// macOS tmp dir handling is brain damaged.
const TMPDIR = os.platform() == 'darwin' ? '/tmp' : os.tmpdir();

export default class S3 {
  s3Client = null;

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      region: process.env.S3_REGION, //NOTE: region is required by @aws-sdk/config-resolver
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true
    });
  }

  async copy({ contentType, acl, sourceBucket, sourceFilename, destinationBucket, destinationFilename }) {
    return await this.s3Client.send(new CopyObjectCommand({
      Bucket: destinationBucket,
      Key: destinationFilename,
      ACL: acl,
      ContentType: contentType,
      CopySource: sourceBucket + '/' + sourceFilename
    }));
  }

  async delete({ bucket, filename }) {
    return await this.s3Client.send(new DeleteObjectCommand({
      Key: filename,
      Bucket: bucket
    }));
  }

  async deleteMultiple({ bucket, filenames }) {
    return await this.s3Client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: filenames.map(filename => ({ Key: filename }))
      }
    }));
  }

  async list({ bucket, prefix }) {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix
    });

    const l = await this.s3Client.send(listObjectsCommand);

    return l.Contents ? l.Contents.map(e => e.Key) : [];
  }

  async uploadFromMemory({ bucket, filename, buffer, args = {} }) {
    return await this.s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: buffer,
      ...args
    }));
  }

  downloadIntoMemory({ bucket, filename }) {
    // While the general eslint rule is a good one, here in this specific case I believe
    // that we use async promise executor properly.

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: filename
      });

      let response = null;
      try {
        response = await this.s3Client.send(getCommand);
      } catch (e) {
        reject(e);
        return;
      }

      // This should not be possible but it really happens.
      if (!response.Body) {
        console.trace('Empty response');
        console.error(response);
        reject(new Error("Empty response body on " + filename + ' at bucket ' + bucket));
        return;
      }

      const chunks = [];
      response.Body.on('readable', () => {
        let chunk = null;
        while ((chunk = response.Body.read())) {
          chunks.push(chunk);
        }
      });

      response.Body.on('error', error => reject(error));

      response.Body.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          size: buffer.byteLength,
          contentType: response.ContentType
        });
      });

      response.Body.resume();
    });
  }

  async downloadIntoTmpFile({ bucket, filename }) {
    const destination = path.join(TMPDIR, 'downloaded-' + randomUUID());

    const result = await this.downloadIntoFile({
      bucket,
      filename,
      destination
    });

    return {
      ...result,
      destination
    };
  }

  downloadIntoFile({ bucket, filename, destination }) {
    // While the general eslint rule is a good one, here in this specific case I believe
    // that we use async promise executor properly.
    return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: filename
      });

      let response = null;

      try {
        response = await this.s3Client.send(getCommand);
      } catch (e) {
        reject(e);
        return;
      }

      // This should not be possible but it really happens.
      if (!response.Body) {
        console.log(response);
        console.trace('Empty response');
        reject(new Error("Empty response body on " + filename + ' at bucket ' + bucket));
        return;
      }

      const outputStream = fs.createWriteStream(destination);

      outputStream.on('close', () => {
        const stat = fs.statSync(destination);

        resolve({
          contentType: response.ContentType,
          size: stat.size
        });
      });

      response.Body.pipe(outputStream);

      response.Body.on('end', () => outputStream.end());

      response.Body.resume();
    });
  }

  // hacky way to get canonical url
  async getUrl({ bucket, filename }) {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: filename
    });

    const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 500 });
    const u = new URL(url);
    return u.origin + u.pathname;
  }

  // https://github.com/aws/aws-sdk-js-v3/issues/2121
  async _getProperlyFormattedSignedUrlUntilFuckingAmazonFixesTheirAWSSDKv3(command, expiresIn) {
    const signer = new S3RequestPresigner({ ...this.s3Client.config });
    const request = await createRequest(this.s3Client, command);

    request.headers.host = `${request.hostname}:${request.port}`;

    const signed = await signer.presign(request, { expiresIn });
    return formatUrl(signed);
  }

  async getSignedUrlGet({ bucket, filename, expiresIn }) {
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: filename
    });

    return await getSignedUrl(this.s3Client, getCommand, { expiresIn });
    //return await this._getProperlyFormattedSignedUrlUntilFuckingAmazonFixesTheirAWSSDKv3(getCommand, expiresIn);
  }

  async getSignedUrlPut({ bucket, filename, contentType, acl, expiresIn }) {
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: contentType,
      ACL: acl
    });

    return await getSignedUrl(this.s3Client, putCommand, { expiresIn });
    //return this._getProperlyFormattedSignedUrlUntilFuckingAmazonFixesTheirAWSSDKv3(putCommand, expiresIn);
  }

  async uploadFolder({ source, destination, bucket }) {
    const files = fs.readdirSync(source, { withFileTypes: true });

    for (const file of files.filter(file => file.isDirectory())) {
      await this.uploadFolder({
        source: path.join(source, file.name),
        destination: path.join(destination, file.name),
        bucket
      });
    }

    for (const file of files.filter(file => file.isFile())) {
      const buffer = fs.readFileSync(path.join(source, file.name));
      const filename = path.join(destination, file.name);
      const contentType = mimeTypes.lookup(file.name);

      // do not catch this, we want to catch the exceptions in the caller function
      await this.uploadFromMemory({
        bucket,
        filename,
        buffer,
        args: {
          ContentType: contentType,
          ACL: 'private'
        }
      });
    }
  }

}
