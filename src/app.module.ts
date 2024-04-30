import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import cloudStorageConfig from './cloud-storage/cloud-storage.config';
import { dbConfig } from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudStorageConfig, dbConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    MulterModule.register({
      dest: './temp/post-images',
    }),
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
