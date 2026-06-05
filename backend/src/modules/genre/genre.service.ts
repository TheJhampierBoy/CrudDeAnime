import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GenreRequestDto } from './dto/genre-request.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { GenreEntity } from './entities/genre.entity';
import { GenreMapper } from './genre.mapper';
import { IGenreService } from './interfaces/genre.service.interface';

@Injectable()
export class GenreService implements IGenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  async findAll(): Promise<GenreResponseDto[]> {
    const entities = await this.genreRepository.find();
    return GenreMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<GenreResponseDto> {
    const entity = await this.genreRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return GenreMapper.toResponse(entity);
  }

  async create(dto: GenreRequestDto): Promise<GenreResponseDto> {
    const entity = GenreMapper.toEntity(dto);
    const saved = await this.genreRepository.save(entity);
    return GenreMapper.toResponse(saved);
  }

  async update(id: number, dto: GenreRequestDto): Promise<GenreResponseDto> {
    const entity = await this.genreRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    entity.name = dto.name;
    const saved = await this.genreRepository.save(entity);
    return GenreMapper.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.genreRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    await this.genreRepository.remove(entity);
  }
}
