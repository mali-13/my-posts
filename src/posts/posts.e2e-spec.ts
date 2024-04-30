import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { Post, Status } from './post.entity';

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
});
