import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenreController } from './genre.controller';
import { GenreEntity } from './entities/genre.entity';
import { GenreService } from './genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [
    GenreService,
    { provide: 'GENRE_SERVICE', useClass: GenreService },
  ],
  exports: ['GENRE_SERVICE'],
})
export class GenreModule {}
