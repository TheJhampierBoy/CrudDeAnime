import { EpisodeCommentResponseDto } from './dto/episode-comment-response.dto';
import { EpisodeCommentEntity } from './entities/episode-comment.entity';

export class EpisodeCommentMapper {
  static toResponse(entity: EpisodeCommentEntity): EpisodeCommentResponseDto {
    const response = new EpisodeCommentResponseDto();
    response.id = entity.id;
    response.episode_id = entity.episode_id;
    response.user_id = entity.user_id;
    response.body = entity.body;
    response.likes_count = entity.likes_count;
    response.created_at = entity.created_at;
    response.updated_at = entity.updated_at;
    return response;
  }

  static toResponseList(
    entities: EpisodeCommentEntity[],
  ): EpisodeCommentResponseDto[] {
    return entities.map((e) => EpisodeCommentMapper.toResponse(e));
  }
}
