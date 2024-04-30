## My Posts

Allows users to **create** image posts and **comment** on them

- [view posts](https://my-posts-app-uewemfrpsa-uw.a.run.app/api#/Posts%20and%20Comments/PostsController_findAll)
- [create post](https://my-posts-app-uewemfrpsa-uw.a.run.app/api#/Posts%20and%20Comments/PostsController_create)
- [comment on post](https://my-posts-app-uewemfrpsa-uw.a.run.app/api#/Posts%20and%20Comments/PostsController_createComment)

# Design

To create new post, User streams file to backend. Beckend in turn streams the file to Cloud Storage(original bucket).
When the streaming ends, a Cloud Function is triggered. It resizes, converts the image and streams it
to Cloud Storage(resizedBucket). Finally, the Cloud Function issues a `PATCH /posts/:postId` to update the post with the
image url.

![Sequence Diagram](https://storage.googleapis.com/post-images-trainspotter/image-upload.png)

To communicate the upload progress **Websockets** are used. The backend emits progress and finish events to User. In
case of
error, User can retry.

## Implementation

Backend is implemented as a lightweight nestjs(nodejs) app. Swagger is used for API documentation. Mysql and typeorm are
used to access the database.

Highlights:

- [stream to cloud storage](https://github.com/mali-13/my-posts/blob/main/src/cloud-storage/cloud-storage.service.ts)
- [cloud function](https://github.com/mali-13/my-posts/blob/main/src/cloud-function/index.js)
- [return posts paged and sorted](https://github.com/mali-13/my-posts/blob/52461ad3744d16314fcb2ce0afae3956a0dd6014/src/posts/posts.service.ts#L32)

Jest is used to write **unit** and **e2e tests**. Artillery is used for **load testing**

## CI&CD

**Github actions** are used to test and build the docker image on every commit on the main branch.
**Helm** is used to manage Kubernetes definitions for staging and prod env. The app is intended to be deployed on a
kubernetes cluster

It currently is also deployed on
the [staging environment](https://my-posts-app-uewemfrpsa-uw.a.run.app/api#/Posts%20and%20Comments/PostsController_findAll)
on Google Cloud using gcloud

To deploy the app in production, secrets and environment variables(These include keys to connect to Google Cloud
services) need to be crated for the production environment.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```