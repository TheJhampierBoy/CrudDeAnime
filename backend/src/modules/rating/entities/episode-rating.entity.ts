import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { EpisodeEntity } from '../../episode/entities/episode.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('episode_rating')
@Unique(['episode_id', 'user_id'])
export class EpisodeRatingEntity {
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

  @Column({ type: 'decimal', precision: 7, scale: 5, nullable: false })
  score_story: number;

  @Column({ type: 'decimal', precision: 7, scale: 5, nullable: false })
  score_animation: number;

  @Column({ type: 'decimal', precision: 7, scale: 5, nullable: false })
  score_music: number;

  @Column({ type: 'decimal', precision: 7, scale: 5, nullable: false })
  score_characters: number;

  @Column({ type: 'decimal', precision: 7, scale: 5, nullable: false })
  final_score: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  updated_at: Date;
}
