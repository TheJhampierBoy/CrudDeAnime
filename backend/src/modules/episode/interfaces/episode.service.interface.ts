import { EpisodeRequestDto } from '../dto/episode-request.dto';
import { EpisodeResponseDto } from '../dto/episode-response.dto';

export interface IEpisodeService {
  findAll(): Promise<EpisodeResponseDto[]>;
  findById(id: number): Promise<EpisodeResponseDto>;
  findBySeasonId(seasonId: number): Promise<EpisodeResponseDto[]>;
  create(dto: EpisodeRequestDto): Promise<EpisodeResponseDto>;
  update(id: number, dto: EpisodeRequestDto): Promise<EpisodeResponseDto>;
  remove(id: number): Promise<void>;
}
