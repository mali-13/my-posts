import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreatePostDto, UpdatePostDto } from './post.dto';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comment, Post } from './post.entity';
import { PageOptionDto } from './helper/page-option.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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

  async findAll(pageOptions: PageOptionDto) {
    const { page, limit } = pageOptions;

    const pagedPostsOrderedByCommentCount = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.comments', 'comment')
      .select(['post.postId', 'COUNT(comment.commentId) as commentCount'])
      .groupBy('post.postId')
      .orderBy('commentCount', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();

    const posts = await this.postRepository.find({
      where: {
        postId: In(pagedPostsOrderedByCommentCount.map((p) => p.postId)),
      },
      relations: { comments: true },
    });

    return posts.map((post) => {
      post.comments = post.comments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 2);
      return post;
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: { comments: true },
      order: {},
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
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

  async createComment(createCommentDto: CreateCommentDto) {
    const post = await this.findOne(createCommentDto.postId);

    const comment = new Comment();
    comment.content = createCommentDto.content;
    // Normally extracted form the session/token. Hardcoded here
    comment.creator = 'Matia';
    comment.post = post;

    return this.commentRepository.save(comment);
  }
}
