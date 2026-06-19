import { SeasonRequestDto } from '../dto/season-request.dto';
import { SeasonResponseDto } from '../dto/season-response.dto';

export interface ISeasonService {
  findAll(): Promise<SeasonResponseDto[]>;
  findById(id: number): Promise<SeasonResponseDto>;
  findByAnimeId(animeId: number): Promise<SeasonResponseDto[]>;
  create(dto: SeasonRequestDto): Promise<SeasonResponseDto>;
  update(id: number, dto: SeasonRequestDto): Promise<SeasonResponseDto>;
  remove(id: number): Promise<void>;
}
