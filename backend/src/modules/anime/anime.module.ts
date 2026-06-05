import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenreEntity } from '../genre/entities/genre.entity';
import { AnimeController } from './anime.controller';
import { AnimeEntity } from './entities/anime.entity';
import { AnimeService } from './anime.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnimeEntity, GenreEntity])],
  controllers: [AnimeController],
  providers: [
    AnimeService,
    { provide: 'ANIME_SERVICE', useClass: AnimeService },
  ],
  exports: ['ANIME_SERVICE', TypeOrmModule],
})
export class AnimeModule {}
