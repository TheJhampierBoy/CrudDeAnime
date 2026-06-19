import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimeEntity } from '../anime/entities/anime.entity';
import { EpisodeEntity } from '../episode/entities/episode.entity';
import { AnimeCommentController } from './anime-comment.controller';
import { AnimeCommentService } from './anime-comment.service';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';
import { AnimeCommentEntity } from './entities/anime-comment.entity';
import { CommentLikeEntity } from './entities/comment-like.entity';
import { EpisodeCommentEntity } from './entities/episode-comment.entity';
import { EpisodeCommentController } from './episode-comment.controller';
import { EpisodeCommentService } from './episode-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnimeCommentEntity,
      EpisodeCommentEntity,
      CommentLikeEntity,
      AnimeEntity,
      EpisodeEntity,
    ]),
  ],
  controllers: [
    AnimeCommentController,
    EpisodeCommentController,
    CommentLikeController,
  ],
  providers: [
    AnimeCommentService,
    EpisodeCommentService,
    CommentLikeService,
    { provide: 'ANIME_COMMENT_SERVICE', useClass: AnimeCommentService },
    { provide: 'EPISODE_COMMENT_SERVICE', useClass: EpisodeCommentService },
    { provide: 'COMMENT_LIKE_SERVICE', useClass: CommentLikeService },
  ],
  exports: [
    'ANIME_COMMENT_SERVICE',
    'EPISODE_COMMENT_SERVICE',
    'COMMENT_LIKE_SERVICE',
  ],
})
export class CommentsModule {}
