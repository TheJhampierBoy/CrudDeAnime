import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentLikeRequestDto } from './dto/comment-like-request.dto';
import { AnimeCommentEntity } from './entities/anime-comment.entity';
import { CommentLikeEntity } from './entities/comment-like.entity';
import { EpisodeCommentEntity } from './entities/episode-comment.entity';
import { ICommentLikeService } from './interfaces/comment-like.service.interface';

@Injectable()
export class CommentLikeService implements ICommentLikeService {
  constructor(
    @InjectRepository(CommentLikeEntity)
    private readonly likeRepository: Repository<CommentLikeEntity>,
    @InjectRepository(AnimeCommentEntity)
    private readonly animeCommentRepository: Repository<AnimeCommentEntity>,
    @InjectRepository(EpisodeCommentEntity)
    private readonly episodeCommentRepository: Repository<EpisodeCommentEntity>,
  ) {}

  async toggle(dto: CommentLikeRequestDto): Promise<{ liked: boolean }> {
    const { user_id, target_type, target_id } = dto;

    // 1. Validate the target comment exists
    if (target_type === 'anime_comment') {
      const comment = await this.animeCommentRepository.findOneBy({
        id: target_id,
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
    } else {
      const comment = await this.episodeCommentRepository.findOneBy({
        id: target_id,
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
    }

    // 2. Check if like already exists
    const existing = await this.likeRepository.findOneBy({
      user_id,
      target_type,
      target_id,
    });

    if (existing) {
      // 3. Unlike: remove like and decrement likes_count
      await this.likeRepository.remove(existing);
      if (target_type === 'anime_comment') {
        await this.animeCommentRepository.decrement(
          { id: target_id },
          'likes_count',
          1,
        );
      } else {
        await this.episodeCommentRepository.decrement(
          { id: target_id },
          'likes_count',
          1,
        );
      }
      return { liked: false };
    }

    // 4. Like: create like and increment likes_count
    const like = this.likeRepository.create({ user_id, target_type, target_id });
    await this.likeRepository.save(like);
    if (target_type === 'anime_comment') {
      await this.animeCommentRepository.increment(
        { id: target_id },
        'likes_count',
        1,
      );
    } else {
      await this.episodeCommentRepository.increment(
        { id: target_id },
        'likes_count',
        1,
      );
    }
    return { liked: true };
  }
}
