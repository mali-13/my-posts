import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { PageOptionDto } from './helper/page-option.dto';

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
  findAll(@Query() pageOptions: PageOptionDto) {
    return this.postsService.findAll(pageOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Post(':id/comments')
  @ApiCreatedResponse({ type: CommentDto })
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.postsService.createComment(createCommentDto);
  }
}
