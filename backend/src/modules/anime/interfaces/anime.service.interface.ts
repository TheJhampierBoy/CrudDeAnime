import { AnimeRequestDto } from '../dto/anime-request.dto';
import { AnimeResponseDto } from '../dto/anime-response.dto';

export interface IAnimeService {
  findAll(): Promise<AnimeResponseDto[]>;
  findById(id: number): Promise<AnimeResponseDto>;
  create(dto: AnimeRequestDto): Promise<AnimeResponseDto>;
  update(id: number, dto: AnimeRequestDto): Promise<AnimeResponseDto>;
  remove(id: number): Promise<void>;
}
