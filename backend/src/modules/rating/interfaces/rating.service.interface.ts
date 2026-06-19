import { RatingRequestDto } from '../dto/rating-request.dto';
import { RatingResponseDto } from '../dto/rating-response.dto';

export interface IRatingService {
  findAll(): Promise<RatingResponseDto[]>;
  findById(id: number): Promise<RatingResponseDto>;
  findByEpisodeId(episodeId: number): Promise<RatingResponseDto[]>;
  create(dto: RatingRequestDto): Promise<RatingResponseDto>;
  update(id: number, dto: RatingRequestDto): Promise<RatingResponseDto>;
  remove(id: number): Promise<void>;
}
