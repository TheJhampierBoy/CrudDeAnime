import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity('comment_like')
@Unique(['user_id', 'target_type', 'target_id'])
export class CommentLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 20, nullable: false })
  target_type: string;

  @Column({ type: 'int', nullable: false })
  target_id: number;
}
