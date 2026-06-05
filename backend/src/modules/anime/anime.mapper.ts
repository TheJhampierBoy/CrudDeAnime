import { AnimeResponseDto } from './dto/anime-response.dto';
import { AnimeEntity } from './entities/anime.entity';

export class AnimeMapper {
  static toResponse(entity: AnimeEntity): AnimeResponseDto {
    const response = new AnimeResponseDto();
    response.id = entity.id;
    response.title = entity.title;
    response.synopsis = entity.synopsis;
    response.status = entity.status;
    response.year = entity.year;
    response.cover_url = entity.cover_url;
    response.avg_score = Number(entity.avg_score);
    response.ratings_count = entity.ratings_count;
    response.created_at = entity.created_at;
    response.updated_at = entity.updated_at;
    response.genres = (entity.genres ?? []).map((g) => ({
      id: g.id,
      name: g.name,
    }));
    return response;
  }

  static toResponseList(entities: AnimeEntity[]): AnimeResponseDto[] {
    return entities.map((entity) => AnimeMapper.toResponse(entity));
  }
}
