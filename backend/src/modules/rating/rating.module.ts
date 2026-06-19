import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EpisodeEntity } from '../episode/entities/episode.entity';
import { SeasonEntity } from '../season/entities/season.entity';
import { UserEntity } from '../user/entities/user.entity';
import { EpisodeRatingEntity } from './entities/episode-rating.entity';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EpisodeRatingEntity,
      EpisodeEntity,
      SeasonEntity,
      UserEntity,
    ]),
  ],
  controllers: [RatingController],
  providers: [
    RatingService,
    { provide: 'RATING_SERVICE', useClass: RatingService },
  ],
  exports: ['RATING_SERVICE', TypeOrmModule],
})
export class RatingModule {}
