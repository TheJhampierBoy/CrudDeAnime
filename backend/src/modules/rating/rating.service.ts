import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EpisodeEntity } from '../episode/entities/episode.entity';
import { SeasonEntity } from '../season/entities/season.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RatingRequestDto } from './dto/rating-request.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { EpisodeRatingEntity } from './entities/episode-rating.entity';
import { IRatingService } from './interfaces/rating.service.interface';
import { RatingMapper } from './rating.mapper';

@Injectable()
export class RatingService implements IRatingService {
  constructor(
    @InjectRepository(EpisodeRatingEntity)
    private readonly ratingRepository: Repository<EpisodeRatingEntity>,
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
    @InjectRepository(SeasonEntity)
    private readonly seasonRepository: Repository<SeasonEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private calculateFinalScore(dto: RatingRequestDto): number {
    return (
      dto.score_story * 0.3 +
      dto.score_animation * 0.25 +
      dto.score_music * 0.2 +
      dto.score_characters * 0.25
    );
  }

  private async recalculateAggregates(episodeId: number): Promise<void> {
    // 1. Fetch episode to get season_id
    const episode = await this.episodeRepository.findOneBy({ id: episodeId });
    if (!episode) {
      // Episode was cascade-deleted; nothing to update
      return;
    }

    // 2. Episode-level aggregate
    const episodeAgg = await this.ratingRepository
      .createQueryBuilder('r')
      .select('AVG(r.final_score)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.episode_id = :episodeId', { episodeId })
      .getRawOne<{ avg: string | null; count: string }>();

    const episodeAvg =
      episodeAgg?.avg != null ? Number(episodeAgg.avg) : 0;
    const episodeCount = parseInt(episodeAgg?.count ?? '0', 10) || 0;

    await this.episodeRepository.update(episodeId, {
      avg_score: episodeAvg,
      ratings_count: episodeCount,
    });

    // 3. Season-level aggregate (all ratings for all episodes in that season)
    const seasonId = episode.season_id;

    const seasonAgg = await this.ratingRepository
      .createQueryBuilder('r')
      .innerJoin('r.episode', 'e')
      .select('AVG(r.final_score)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('e.season_id = :seasonId', { seasonId })
      .getRawOne<{ avg: string | null; count: string }>();

    const seasonAvg =
      seasonAgg?.avg != null ? Number(seasonAgg.avg) : 0;
    const seasonCount = parseInt(seasonAgg?.count ?? '0', 10) || 0;

    await this.seasonRepository.update(seasonId, {
      avg_score: seasonAvg,
      ratings_count: seasonCount,
    });
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async findAll(): Promise<RatingResponseDto[]> {
    const entities = await this.ratingRepository.find();
    return RatingMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<RatingResponseDto> {
    const entity = await this.ratingRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }
    return RatingMapper.toResponse(entity);
  }

  async findByEpisodeId(episodeId: number): Promise<RatingResponseDto[]> {
    const entities = await this.ratingRepository.findBy({
      episode_id: episodeId,
    });
    return RatingMapper.toResponseList(entities);
  }

  async create(dto: RatingRequestDto): Promise<RatingResponseDto> {
    const episode = await this.episodeRepository.findOneBy({
      id: dto.episode_id,
    });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    const user = await this.userRepository.findOneBy({ id: dto.user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const final_score = this.calculateFinalScore(dto);

    const entity = this.ratingRepository.create({
      episode_id: dto.episode_id,
      user_id: dto.user_id,
      score_story: dto.score_story,
      score_animation: dto.score_animation,
      score_music: dto.score_music,
      score_characters: dto.score_characters,
      final_score,
    });

    try {
      const saved = await this.ratingRepository.save(entity);
      await this.recalculateAggregates(dto.episode_id);
      return RatingMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException('User has already rated this episode');
      }
      throw err;
    }
  }

  async update(id: number, dto: RatingRequestDto): Promise<RatingResponseDto> {
    const existing = await this.ratingRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    const final_score = this.calculateFinalScore(dto);

    Object.assign(existing, {
      episode_id: dto.episode_id,
      user_id: dto.user_id,
      score_story: dto.score_story,
      score_animation: dto.score_animation,
      score_music: dto.score_music,
      score_characters: dto.score_characters,
      final_score,
      updated_at: new Date(),
    });

    try {
      const saved = await this.ratingRepository.save(existing);
      await this.recalculateAggregates(existing.episode_id);
      return RatingMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException('User has already rated this episode');
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const entity = await this.ratingRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }
    const episodeId = entity.episode_id;
    await this.ratingRepository.remove(entity);
    await this.recalculateAggregates(episodeId);
  }
}
