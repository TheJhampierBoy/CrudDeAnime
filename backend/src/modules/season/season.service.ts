import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnimeEntity } from '../anime/entities/anime.entity';
import { SeasonRequestDto } from './dto/season-request.dto';
import { SeasonResponseDto } from './dto/season-response.dto';
import { SeasonEntity } from './entities/season.entity';
import { ISeasonService } from './interfaces/season.service.interface';
import { SeasonMapper } from './season.mapper';

@Injectable()
export class SeasonService implements ISeasonService {
  constructor(
    @InjectRepository(SeasonEntity)
    private readonly seasonRepository: Repository<SeasonEntity>,
    @InjectRepository(AnimeEntity)
    private readonly animeRepository: Repository<AnimeEntity>,
  ) {}

  async findAll(): Promise<SeasonResponseDto[]> {
    const entities = await this.seasonRepository.find();
    return SeasonMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<SeasonResponseDto> {
    const entity = await this.seasonRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Season with id ${id} not found`);
    }
    return SeasonMapper.toResponse(entity);
  }

  async findByAnimeId(animeId: number): Promise<SeasonResponseDto[]> {
    const entities = await this.seasonRepository.findBy({
      anime_id: animeId,
    });
    return SeasonMapper.toResponseList(entities);
  }

  async create(dto: SeasonRequestDto): Promise<SeasonResponseDto> {
    const anime = await this.animeRepository.findOneBy({ id: dto.anime_id });
    if (!anime) {
      throw new NotFoundException('Anime not found');
    }

    const entity = SeasonMapper.toEntity(dto);
    try {
      const saved = await this.seasonRepository.save(entity);
      return SeasonMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException(
          'Season number already exists for this anime',
        );
      }
      throw err;
    }
  }

  async update(id: number, dto: SeasonRequestDto): Promise<SeasonResponseDto> {
    const entity = await this.seasonRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Season with id ${id} not found`);
    }

    Object.assign(entity, {
      anime_id: dto.anime_id,
      number: dto.number,
      title: dto.title ?? entity.title,
      year: dto.year ?? entity.year,
    });

    try {
      const saved = await this.seasonRepository.save(entity);
      return SeasonMapper.toResponse(saved);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException(
          'Season number already exists for this anime',
        );
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const entity = await this.seasonRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Season with id ${id} not found`);
    }
    await this.seasonRepository.remove(entity);
  }
}
