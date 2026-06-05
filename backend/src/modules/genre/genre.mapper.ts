import { GenreRequestDto } from './dto/genre-request.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { GenreEntity } from './entities/genre.entity';

export class GenreMapper {
  static toEntity(dto: GenreRequestDto): GenreEntity {
    const entity = new GenreEntity();
    entity.name = dto.name;
    return entity;
  }

  static toResponse(entity: GenreEntity): GenreResponseDto {
    const response = new GenreResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    return response;
  }

  static toResponseList(entities: GenreEntity[]): GenreResponseDto[] {
    return entities.map((entity) => GenreMapper.toResponse(entity));
  }
}
