import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnimeEntity } from '../anime/entities/anime.entity';
import { AnimeCommentMapper } from './anime-comment.mapper';
import { AnimeCommentRequestDto } from './dto/anime-comment-request.dto';
import { AnimeCommentResponseDto } from './dto/anime-comment-response.dto';
import { AnimeCommentEntity } from './entities/anime-comment.entity';
import { IAnimeCommentService } from './interfaces/anime-comment.service.interface';

@Injectable()
export class AnimeCommentService implements IAnimeCommentService {
  constructor(
    @InjectRepository(AnimeCommentEntity)
    private readonly repo: Repository<AnimeCommentEntity>,
    @InjectRepository(AnimeEntity)
    private readonly animeRepository: Repository<AnimeEntity>,
  ) {}

  async findAll(): Promise<AnimeCommentResponseDto[]> {
    const entities = await this.repo.find();
    return AnimeCommentMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<AnimeCommentResponseDto> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`AnimeComment with id ${id} not found`);
    }
    return AnimeCommentMapper.toResponse(entity);
  }

  async findByAnimeId(animeId: number): Promise<AnimeCommentResponseDto[]> {
    const entities = await this.repo.findBy({ anime_id: animeId });
    return AnimeCommentMapper.toResponseList(entities);
  }

  async create(dto: AnimeCommentRequestDto): Promise<AnimeCommentResponseDto> {
    const anime = await this.animeRepository.findOneBy({ id: dto.anime_id });
    if (!anime) {
      throw new NotFoundException('Anime not found');
    }
    const entity = this.repo.create({
      anime_id: dto.anime_id,
      user_id: dto.user_id,
      body: dto.body,
    });
    const saved = await this.repo.save(entity);
    return AnimeCommentMapper.toResponse(saved);
  }

  async update(id: number, body: string): Promise<AnimeCommentResponseDto> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`AnimeComment with id ${id} not found`);
    }
    entity.body = body;
    entity.updated_at = new Date();
    const saved = await this.repo.save(entity);
    return AnimeCommentMapper.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`AnimeComment with id ${id} not found`);
    }
    await this.repo.remove(entity);
  }
}
