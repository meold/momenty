import 'dotenv/config';
import { create } from 'ipfs-core';
import S3 from './S3.mjs';

const s3 = new S3();

const ipfsAddOptions = {
  cidVersion: 1,
  hashAlg: "sha2-256",
};

export async function ipfsUpload(filenameImage, filenameVideo, name, description) {
  const streamImage = await s3.createReadStream({
    bucket: process.env.S3_BUCKET_INCOMING_MEDIA,
    filename: filenameImage
  });

  const streamVideo = await s3.createReadStream({
    bucket: process.env.S3_BUCKET_INCOMING_MEDIA,
    filename: filenameVideo
  });

  const ipfs = await create();

  let res;
  try {
    res = await Promise.all([
      ipfs.add({
        content: streamImage.Body,
        path: '/nft/' + filenameImage
      }, ipfsAddOptions),
      ipfs.add({
        content: streamVideo.Body,
        path: '/nft/' + filenameVideo
      }, ipfsAddOptions)
    ]);
  } catch (error) {
    // ipfs.stop();
    return null;
  }

  if (!res) {
    // ipfs.stop();
    return null;
  }

  const metadata = {
    name,
    description,
    image: `ipfs://${res[0].cid}/${filenameImage}`,
    video: `ipfs://${res[1].cid}/${filenameVideo}`,
  };

  let result;
  try {
    result = await ipfs.add({
      content: JSON.stringify(metadata),
      path: '/nft/' + 'metadata.json'
    }, ipfsAddOptions);
  } catch (error) {
    // ipfs.stop();
    return null;
  }

  // ipfs.stop();

  if (!result) {
    return null;
  }

  const metadataUri = `ipfs://${result.cid}/metadata.json`;

  return metadataUri;
}
