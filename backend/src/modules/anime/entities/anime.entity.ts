import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GenreEntity } from '../../genre/entities/genre.entity';

@Entity('anime')
export class AnimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  synopsis: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @Column({ type: 'smallint', nullable: true })
  year: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_url: string;

  @Column({ type: 'decimal', precision: 7, scale: 5, default: 0 })
  avg_score: number;

  @Column({ type: 'int', default: 0 })
  ratings_count: number;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  updated_at: Date;

  @ManyToMany(() => GenreEntity, { eager: false })
  @JoinTable({
    name: 'anime_genre',
    joinColumn: { name: 'anime_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: GenreEntity[];
}
