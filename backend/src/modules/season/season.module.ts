import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimeEntity } from '../anime/entities/anime.entity';
import { SeasonController } from './season.controller';
import { SeasonEntity } from './entities/season.entity';
import { SeasonService } from './season.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity, AnimeEntity])],
  controllers: [SeasonController],
  providers: [
    SeasonService,
    { provide: 'SEASON_SERVICE', useClass: SeasonService },
  ],
  exports: ['SEASON_SERVICE', TypeOrmModule],
})
export class SeasonModule {}
