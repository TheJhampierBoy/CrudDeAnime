import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeasonEntity } from '../season/entities/season.entity';
import { EpisodeController } from './episode.controller';
import { EpisodeEntity } from './entities/episode.entity';
import { EpisodeService } from './episode.service';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeEntity, SeasonEntity])],
  controllers: [EpisodeController],
  providers: [
    EpisodeService,
    { provide: 'EPISODE_SERVICE', useClass: EpisodeService },
  ],
  exports: ['EPISODE_SERVICE', TypeOrmModule],
})
export class EpisodeModule {}
