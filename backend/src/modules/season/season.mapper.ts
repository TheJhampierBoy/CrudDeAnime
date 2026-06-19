import { SeasonRequestDto } from './dto/season-request.dto';
import { SeasonResponseDto } from './dto/season-response.dto';
import { SeasonEntity } from './entities/season.entity';

export class SeasonMapper {
  static toEntity(dto: SeasonRequestDto): SeasonEntity {
    const entity = new SeasonEntity();
    entity.anime_id = dto.anime_id;
    entity.number = dto.number;
    entity.title = dto.title ?? null;
    entity.year = dto.year ?? null;
    return entity;
  }

  static toResponse(entity: SeasonEntity): SeasonResponseDto {
    const response = new SeasonResponseDto();
    response.id = entity.id;
    response.anime_id = entity.anime_id;
    response.number = entity.number;
    response.title = entity.title;
    response.year = entity.year;
    response.avg_score = Number(entity.avg_score);
    response.ratings_count = entity.ratings_count;
    response.created_at = entity.created_at;
    return response;
  }

  static toResponseList(entities: SeasonEntity[]): SeasonResponseDto[] {
    return entities.map((entity) => SeasonMapper.toResponse(entity));
  }
}
