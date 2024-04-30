import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';

@Injectable()
export class PostsService {
  constructor(private readonly gcsStorageService: CloudStorageService) {}

  create(createPostDto: CreatePostDto, image: Express.Multer.File) {
    // Asynchronously stream image to cloud storage(bucket)
    this.gcsStorageService.uploadFile(image, 1);
    return 'This action adds a new post';
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
