import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { GenreEntity } from '../genre/entities/genre.entity';
import { AnimeMapper } from './anime.mapper';
import { AnimeRequestDto } from './dto/anime-request.dto';
import { AnimeResponseDto } from './dto/anime-response.dto';
import { AnimeEntity } from './entities/anime.entity';
import { IAnimeService } from './interfaces/anime.service.interface';

@Injectable()
export class AnimeService implements IAnimeService {
  constructor(
    @InjectRepository(AnimeEntity)
    private readonly animeRepository: Repository<AnimeEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  async findAll(): Promise<AnimeResponseDto[]> {
    const entities = await this.animeRepository.find({
      relations: { genres: true },
    });
    return AnimeMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<AnimeResponseDto> {
    const entity = await this.animeRepository.findOne({
      where: { id },
      relations: { genres: true },
    });
    if (!entity) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }
    return AnimeMapper.toResponse(entity);
  }

  async create(dto: AnimeRequestDto): Promise<AnimeResponseDto> {
    const genres =
      dto.genreIds && dto.genreIds.length > 0
        ? await this.genreRepository.findBy({ id: In(dto.genreIds) })
        : [];

    const anime = this.animeRepository.create({
      title: dto.title,
      synopsis: dto.synopsis,
      status: dto.status,
      year: dto.year,
      cover_url: dto.cover_url,
      genres,
    });

    const saved = await this.animeRepository.save(anime);
    return AnimeMapper.toResponse(saved);
  }

  async update(id: number, dto: AnimeRequestDto): Promise<AnimeResponseDto> {
    const existing = await this.animeRepository.findOne({
      where: { id },
      relations: { genres: true },
    });
    if (!existing) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }

    const genres =
      dto.genreIds !== undefined
        ? dto.genreIds.length > 0
          ? await this.genreRepository.findBy({ id: In(dto.genreIds) })
          : []
        : undefined;

    Object.assign(existing, {
      title: dto.title,
      synopsis: dto.synopsis,
      status: dto.status,
      year: dto.year,
      cover_url: dto.cover_url,
      updated_at: new Date(),
    });

    if (genres !== undefined) {
      existing.genres = genres;
    }

    const saved = await this.animeRepository.save(existing);
    return AnimeMapper.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.animeRepository.findOne({
      where: { id },
      relations: { genres: true },
    });
    if (!entity) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }
    await this.animeRepository.remove(entity);
  }
}
