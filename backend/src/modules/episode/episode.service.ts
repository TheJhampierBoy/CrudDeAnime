import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SeasonEntity } from '../season/entities/season.entity';
import { EpisodeRequestDto } from './dto/episode-request.dto';
import { EpisodeResponseDto } from './dto/episode-response.dto';
import { EpisodeEntity } from './entities/episode.entity';
import { IEpisodeService } from './interfaces/episode.service.interface';
import { EpisodeMapper } from './episode.mapper';

@Injectable()
export class EpisodeService implements IEpisodeService {
  constructor(
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
    @InjectRepository(SeasonEntity)
    private readonly seasonRepository: Repository<SeasonEntity>,
  ) {}

  async findAll(): Promise<EpisodeResponseDto[]> {
    const entities = await this.episodeRepository.find();
    return EpisodeMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<EpisodeResponseDto> {
    const entity = await this.episodeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Episode with id ${id} not found`);
    }
    return EpisodeMapper.toResponse(entity);
  }

  async findBySeasonId(seasonId: number): Promise<EpisodeResponseDto[]> {
    const entities = await this.episodeRepository.findBy({
      season_id: seasonId,
    });
    return EpisodeMapper.toResponseList(entities);
  }

  async create(dto: EpisodeRequestDto): Promise<EpisodeResponseDto> {
    const season = await this.seasonRepository.findOneBy({ id: dto.season_id });
    if (!season) {
      throw new NotFoundException('Season not found');
    }

    const entity = EpisodeMapper.toEntity(dto);
    try {
      const saved = await this.episodeRepository.save(entity);
      return EpisodeMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException(
          'Episode number already exists for this season',
        );
      }
      throw err;
    }
  }

  async update(id: number, dto: EpisodeRequestDto): Promise<EpisodeResponseDto> {
    const entity = await this.episodeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Episode with id ${id} not found`);
    }

    Object.assign(entity, {
      season_id: dto.season_id,
      number: dto.number,
      title: dto.title ?? entity.title,
      synopsis: dto.synopsis ?? entity.synopsis,
      aired_at: dto.aired_at ?? entity.aired_at,
      duration_sec: dto.duration_sec ?? entity.duration_sec,
    });

    try {
      const saved = await this.episodeRepository.save(entity);
      return EpisodeMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException(
          'Episode number already exists for this season',
        );
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const entity = await this.episodeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Episode with id ${id} not found`);
    }
    await this.episodeRepository.remove(entity);
  }
}
