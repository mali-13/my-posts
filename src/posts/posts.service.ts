import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly gcsStorageService: CloudStorageService,
  ) {}

  async create(createPostDto: CreatePostDto, image: Express.Multer.File) {
    const post = new Post();
    post.caption = createPostDto.caption;
    // Normally extracted form the session/token. Hardcoded here
    post.creator = 'Rita';
    const createdPost = await this.postRepository.save(post);

    // Asynchronously stream image to cloud storage(bucket)
    this.gcsStorageService.uploadFile(image, createdPost.postId);

    return createdPost;
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ postId: id });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.status = updatePostDto.status;
    post.image = updatePostDto.image;
    post.caption = updatePostDto.caption;

    return await this.postRepository.save(post);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
