import { PostsService } from './posts.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { Repository } from 'typeorm';
import { Post, Status } from './entities/post.entity';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostsService', () => {
  let service: PostsService;
  let cloudStorageService: jest.Mocked<CloudStorageService>;
  let repository: jest.Mocked<Repository<Post>>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PostsService).compile();

    service = unit;
    cloudStorageService = unitRef.get(CloudStorageService);
    repository = unitRef.get(getRepositoryToken(Post) as string);
  });

  test('creates new post', async () => {
    const imageFile: Express.Multer.File = {
      buffer: Buffer.from('image buffer data'),
      destination: 'uploads/',
      encoding: 'utf-8',
      fieldname: 'image',
      filename: 'nice_view.jpg',
      mimetype: 'image/jpeg',
      originalname: 'nice_view.jpg',
      path: 'uploads/nice_view.jpg',
      size: 1024, // Replace 1024 with the actual size of the image
      stream: undefined,
    };

    const caption = 'A window view of Nice';

    const expectedCreatedPost = {
      caption,
      creator: 'Rita',
      image: null,
      postId: 1,
      status: Status.IMAGE_UPLOADING,
      createdAt: new Date(),
      comments: [],
    };

    const uploadFileSpy = jest
      .spyOn(cloudStorageService, 'uploadFile')
      .mockResolvedValue();

    jest.spyOn(repository, 'save').mockResolvedValue(expectedCreatedPost);

    const createdPost = await service.create({ caption }, imageFile);

    expect(createdPost).toEqual(expectedCreatedPost);
    expect(uploadFileSpy).toHaveBeenCalledWith(
      imageFile,
      expectedCreatedPost.postId,
    );
  });
});
