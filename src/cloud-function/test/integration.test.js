const assert = require('assert');
const { Storage } = require('@google-cloud/storage');
const sinon = require('sinon');
const supertest = require('supertest');
const functionsFramework = require('@google-cloud/functions-framework/testing');

const storage = new Storage();

const BUCKET_NAME = process.env.FUNCTIONS_BUCKET;
const { RESIZED_BUCKET_NAME } = process.env;
const blurredBucket = storage.bucket(RESIZED_BUCKET_NAME);

require('../index');

describe('functions/resiseAndFormatImage tests', () => {
  it('resizes image', async () => {
    // test not implemented yet
  });

  it('makes REST call to update post with image', async () => {
    // test not implemented yet
  });
});
