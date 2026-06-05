import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRequestDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './interfaces/user.service.interface';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const entities = await this.userRepository.find();
    return UserMapper.toResponseList(entities);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toResponse(entity);
  }

  async create(dto: UserRequestDto): Promise<UserResponseDto> {
    const entity = UserMapper.toEntity(dto);
    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(saved);
  }

  async update(id: number, dto: UserRequestDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    entity.name = dto.name;
    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.remove(entity);
  }
}
