import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Column()
  creator: string;

  @CreateDateColumn()
  createdAt: Date;
}
