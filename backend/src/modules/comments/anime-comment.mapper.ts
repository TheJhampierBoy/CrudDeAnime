import { AnimeCommentResponseDto } from './dto/anime-comment-response.dto';
import { AnimeCommentEntity } from './entities/anime-comment.entity';

export class AnimeCommentMapper {
  static toResponse(entity: AnimeCommentEntity): AnimeCommentResponseDto {
    const response = new AnimeCommentResponseDto();
    response.id = entity.id;
    response.anime_id = entity.anime_id;
    response.user_id = entity.user_id;
    response.body = entity.body;
    response.likes_count = entity.likes_count;
    response.created_at = entity.created_at;
    response.updated_at = entity.updated_at;
    return response;
  }

  static toResponseList(
    entities: AnimeCommentEntity[],
  ): AnimeCommentResponseDto[] {
    return entities.map((e) => AnimeCommentMapper.toResponse(e));
  }
}
