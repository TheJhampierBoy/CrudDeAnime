import { EpisodeRequestDto } from './dto/episode-request.dto';
import { EpisodeResponseDto } from './dto/episode-response.dto';
import { EpisodeEntity } from './entities/episode.entity';

export class EpisodeMapper {
  static toEntity(dto: EpisodeRequestDto): EpisodeEntity {
    const entity = new EpisodeEntity();
    entity.season_id = dto.season_id;
    entity.number = dto.number;
    entity.title = dto.title ?? null;
    entity.synopsis = dto.synopsis ?? null;
    entity.aired_at = dto.aired_at ?? null;
    entity.duration_sec = dto.duration_sec ?? null;
    return entity;
  }

  static toResponse(entity: EpisodeEntity): EpisodeResponseDto {
    const response = new EpisodeResponseDto();
    response.id = entity.id;
    response.season_id = entity.season_id;
    response.number = entity.number;
    response.title = entity.title;
    response.synopsis = entity.synopsis;
    response.aired_at = entity.aired_at;
    response.duration_sec = entity.duration_sec;
    response.avg_score = Number(entity.avg_score);
    response.ratings_count = entity.ratings_count;
    response.created_at = entity.created_at;
    return response;
  }

  static toResponseList(entities: EpisodeEntity[]): EpisodeResponseDto[] {
    return entities.map((entity) => EpisodeMapper.toResponse(entity));
  }
}
