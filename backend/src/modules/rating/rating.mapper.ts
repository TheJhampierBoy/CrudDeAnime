import { RatingResponseDto } from './dto/rating-response.dto';
import { EpisodeRatingEntity } from './entities/episode-rating.entity';

export class RatingMapper {
  static toResponse(entity: EpisodeRatingEntity): RatingResponseDto {
    const response = new RatingResponseDto();
    response.id = entity.id;
    response.episode_id = entity.episode_id;
    response.user_id = entity.user_id;
    response.score_story = Number(entity.score_story);
    response.score_animation = Number(entity.score_animation);
    response.score_music = Number(entity.score_music);
    response.score_characters = Number(entity.score_characters);
    response.final_score = Number(entity.final_score);
    response.created_at = entity.created_at;
    response.updated_at = entity.updated_at;
    return response;
  }

  static toResponseList(entities: EpisodeRatingEntity[]): RatingResponseDto[] {
    return entities.map((entity) => RatingMapper.toResponse(entity));
  }
}
