import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

export enum Status {
  IMAGE_UPLOADING = 'image_uploading',
  IMAGE_UPLOADED = 'image_uploaded',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  caption: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'enum', enum: Status, default: Status.IMAGE_UPLOADING })
  status: Status;

  @Column()
  creator: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
