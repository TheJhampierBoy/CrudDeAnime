import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genre')
export class GenreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;
}
