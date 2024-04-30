import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CommentDto,
  CreateCommentDto,
  CreatePostDto,
  PostDto,
  UpdatePostDto,
} from './post.dto';
import { UploadedImage } from './helper/uploaded-image.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: PostDto })
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedImage()
    image: Express.Multer.File,
  ) {
    return this.postsService.create(createPostDto, image);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post(':id/comments')
  @ApiCreatedResponse({ type: CommentDto })
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.postsService.createComment(createCommentDto);
  }
}
