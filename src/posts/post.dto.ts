import { IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';
import { Comment } from './entities/comment.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Post, Status } from './entities/post.entity';

export class CreatePostDto {
  /**
   * Caption of image. Should be descriptive and short
   * @example 'A window view of Nice'
   */
  @IsString()
  caption: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  /**
   * ID of the post to be updated
   * @example 1
   */
  @IsNumber()
  postId: number;

  /**
   * URL of the image to be updated
   * @example 'https://storage.googleapis.com/post-images-resized-trainspotter/2-05df18a9-54ed-4472-be20-70ad8b5b9ea3-nice.png'
   */
  @IsUrl()
  image: string;

  /**
   * Status of the post
   * @example Status.IMAGE_UPLOADING
   */
  @IsEnum(Status)
  status: Status;
}

export class PostDto implements Omit<Post, 'comments'> {
  /**
   * Caption of the post
   * @example 'A window view of Nice'
   */
  caption: string;

  /**
   * Array of comments on the post
   * @example []
   */
  comments: CommentDto[];

  /**
   * Date and time when the post was created
   * @example '2024-04-30T12:00:00.000Z'
   */
  createdAt: Date;

  /**
   * Creator of the post
   * @example 'Rita James'
   */
  creator: string;

  /**
   * URL of the image in the post
   * @example 'https://storage.googleapis.com/post-images-resized-trainspotter/2-05df18a9-54ed-4472-be20-70ad8b5b9ea3-nice.png'
   */
  image: string;

  /**
   * ID of the post
   * @example 1
   */
  postId: number;

  /**
   * Status of the post
   * @example Status.IMAGE_UPLOADING
   */
  status: Status;
}

export class CommentDto implements Omit<Comment, 'post'> {
  /**
   * ID of the comment
   * @example 1
   */
  commentId: number;

  /**
   * Content of the comment
   * @example 'Beautiful!'
   */
  content: string;

  /**
   * Post to which the comment belongs
   * @example PostDto
   */
  post: PostDto;

  /**
   * Creator of the comment
   * @example 'JaneDoe'
   */
  creator: string;

  /**
   * Date and time when the comment was created
   * @example '2024-04-30T12:05:00.000Z'
   */
  createdAt: Date;
}
