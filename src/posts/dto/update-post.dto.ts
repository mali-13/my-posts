import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsEnum, IsNumber, IsUrl } from 'class-validator';
import { Status } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  postId: number;

  @IsUrl()
  image: string;

  @IsEnum(Status)
  status: Status;
}
