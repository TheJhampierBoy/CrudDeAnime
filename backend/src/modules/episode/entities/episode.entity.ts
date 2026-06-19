import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { SeasonEntity } from '../../season/entities/season.entity';

@Entity('episode')
@Unique(['season_id', 'number'])
export class EpisodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  season_id: number;

  @ManyToOne(() => SeasonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'season_id' })
  season: SeasonEntity;

  @Column({ type: 'smallint', nullable: false })
  number: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  synopsis: string | null;

  @Column({ type: 'date', nullable: true })
  aired_at: string | null;

  @Column({ type: 'int', nullable: true })
  duration_sec: number | null;

  @Column({ type: 'decimal', precision: 7, scale: 5, default: 0 })
  avg_score: number;

  @Column({ type: 'int', default: 0 })
  ratings_count: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;
}
