import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AnimeEntity } from '../../anime/entities/anime.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('anime_comment')
export class AnimeCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  anime_id: number;

  @ManyToOne(() => AnimeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anime_id' })
  anime: AnimeEntity;

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
