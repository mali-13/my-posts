import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CloudStorageModule } from '../cloud-storage/cloud-storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Post } from './post.entity';

@Module({
  imports: [CloudStorageModule, TypeOrmModule.forFeature([Post, Comment])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
