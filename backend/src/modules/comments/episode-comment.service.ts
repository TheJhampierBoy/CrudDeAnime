import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EpisodeEntity } from '../episode/entities/episode.entity';
import { EpisodeCommentMapper } from './episode-comment.mapper';
import { EpisodeCommentRequestDto } from './dto/episode-comment-request.dto';
import { EpisodeCommentResponseDto } from './dto/episode-comment-response.dto';
import { EpisodeCommentEntity } from './entities/episode-comment.entity';
import { IEpisodeCommentService } from './interfaces/episode-comment.service.interface';

@Injectable()
export class EpisodeCommentService implements IEpisodeCommentService {
  constructor(
    @InjectRepository(EpisodeCommentEntity)
    private readonly repo: Repository<EpisodeCommentEntity>,
    @InjectRepository(EpisodeEntity)
    private readonly episodeRepository: Repository<EpisodeEntity>,
  ) {}

  async findAll(): Promise<EpisodeCommentResponseDto[]> {
    const entities = await this.repo.find();
    return EpisodeCommentMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<EpisodeCommentResponseDto> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`EpisodeComment with id ${id} not found`);
    }
    return EpisodeCommentMapper.toResponse(entity);
  }

  async findByEpisodeId(
    episodeId: number,
  ): Promise<EpisodeCommentResponseDto[]> {
    const entities = await this.repo.findBy({ episode_id: episodeId });
    return EpisodeCommentMapper.toResponseList(entities);
  }

  async create(
    dto: EpisodeCommentRequestDto,
  ): Promise<EpisodeCommentResponseDto> {
    const episode = await this.episodeRepository.findOneBy({
      id: dto.episode_id,
    });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    const entity = this.repo.create({
      episode_id: dto.episode_id,
      user_id: dto.user_id,
      body: dto.body,
    });
    const saved = await this.repo.save(entity);
    return EpisodeCommentMapper.toResponse(saved);
  }

  async update(id: number, body: string): Promise<EpisodeCommentResponseDto> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`EpisodeComment with id ${id} not found`);
    }
    entity.body = body;
    entity.updated_at = new Date();
    const saved = await this.repo.save(entity);
    return EpisodeCommentMapper.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`EpisodeComment with id ${id} not found`);
    }
    await this.repo.remove(entity);
  }
}
