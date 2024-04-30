import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { Post, Status } from './post.entity';
import { UpdatePostDto } from './post.dto';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let cloudStorageService: CloudStorageService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    cloudStorageService = app.get<CloudStorageService>(CloudStorageService);

    await app.init();
  });

  describe('POST /post', () => {
    test('throws when no image in request', async () => {
      const caption = 'A window view of Nice';

      await request(app.getHttpServer())
        .post('/posts')
        .field('caption', caption)
        .expect(422);
    });
    test('throws when file not an image', async () => {
      const caption = 'A window view of Nice';

      await request(app.getHttpServer())
        .post('/posts')
        .field('caption', caption)
        .attach('file', './src/posts/fixtures/i-am-a-text-file.txt')
        .expect(422);
    });
    test('creates new post', async () => {
      const caption = 'A window view of Nice';

      jest.spyOn(cloudStorageService, 'uploadFile').mockResolvedValue();

      const { body: createdPost } = await request(app.getHttpServer())
        .post('/posts')
        .field('caption', caption)
        .attach('file', './src/posts/fixtures/nice.png')
        .expect(201);

      const expectedPost: Partial<Post> = {
        postId: expect.any(Number),
        caption: caption,
        status: Status.IMAGE_UPLOADING,
        creator: 'Rita',
      };

      expect(createdPost).toMatchObject(expectedPost);
    });
  });

  describe('PATCH /post', () => {
    test('updates post', async () => {
      const updatePostDto: UpdatePostDto = {
        image:
          'https://storage.googleapis.com/post-images-resized-trainspotter/2-05df18a9-54ed-4472-be20-70ad8b5b9ea3-nice.png',
        postId: 1,
        status: Status.IMAGE_UPLOADED,
      };

      const { body: createdPost } = await request(app.getHttpServer())
        .patch('/posts/1')
        .send(updatePostDto)
        .expect(200);

      expect(createdPost).toMatchObject({
        postId: updatePostDto.postId,
        status: updatePostDto.status,
        image: updatePostDto.image,
      });
    });
  });
});
