import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { AnimeEntity } from '../../anime/entities/anime.entity';

@Entity('season')
@Unique(['anime_id', 'number'])
export class SeasonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  anime_id: number;

  @ManyToOne(() => AnimeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anime_id' })
  anime: AnimeEntity;

  @Column({ type: 'smallint', nullable: false })
  number: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'smallint', nullable: true })
  year: number | null;

  @Column({ type: 'decimal', precision: 7, scale: 5, default: 0 })
  avg_score: number;

  @Column({ type: 'int', default: 0 })
  ratings_count: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;
}
