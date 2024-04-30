import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
