'use strict';

const functions = require('@google-cloud/functions-framework');
const gm = require('gm').subClass({ imageMagick: true });

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const fetch = require('node-fetch');

const { RESIZED_BUCKET_NAME, PATCH_POST_ENDPOINT } = process.env;

// Resizes the given image using ImageMagick, converts it to jpeg and uploads it to another bucket.
functions.cloudEvent('resizeAndFormatImages', async (cloudEvent) => {
  // This event represents the triggering Cloud Storage object.
  const bucket = cloudEvent.data.bucket;
  const name = cloudEvent.data.name;
  const imageFile = storage.bucket(bucket).file(name);
  const originalReadStream = imageFile.createReadStream();

  const resizedBucket = storage.bucket(RESIZED_BUCKET_NAME);
  const resizeFile = resizedBucket.file(imageFile.name);
  const resizedWriteStream = resizeFile.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  const postId = name.split('-')[0];
  console.log(`postId: ${postId}`);

  await new Promise((resolve, reject) => {
    gm(originalReadStream)
      .resize(600, 600)
      .stream('jpeg') // Format to jpeg
      .pipe(resizedWriteStream)
      .on('finish', async () => {
        console.log(
          `Image ${imageFile.name} resized formated and witten to ${resizedBucket.name}.`,
        );

        const resizedImageUrl = `https://storage.googleapis.com/${resizedBucket.name}/${imageFile.name}`;

        await updatePost(postId, resizedImageUrl);
        resolve();
      })
      .on('error', (err) => {
        console.log(`Error: ${err} `);
        reject(err);
      });
  });
});

async function updatePost(postId, resizedImageUrl) {
  console.log(`Updating post: ${postId}`);
  const postDto = {
    postId,
    status: 'image_uploaded',
    image: resizedImageUrl,
  };

  const response = await fetch(`${PATCH_POST_ENDPOINT}/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postDto),
  });
  const data = await response.json();
  console.log(`Updated post: ${data}`);
}
