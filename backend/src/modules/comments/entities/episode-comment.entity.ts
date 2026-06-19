import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('episode_comment')
export class EpisodeCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  episode_id: number;

  @ManyToOne(() => EpisodeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'episode_id' })
  episode: EpisodeEntity;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ type: 'int', default: 0 })
  likes_count: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  updated_at: Date;
}
