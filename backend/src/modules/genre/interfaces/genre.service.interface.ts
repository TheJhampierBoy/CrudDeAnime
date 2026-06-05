import { GenreRequestDto } from '../dto/genre-request.dto';
import { GenreResponseDto } from '../dto/genre-response.dto';

export interface IGenreService {
  findAll(): Promise<GenreResponseDto[]>;
  findById(id: number): Promise<GenreResponseDto>;
  create(dto: GenreRequestDto): Promise<GenreResponseDto>;
  update(id: number, dto: GenreRequestDto): Promise<GenreResponseDto>;
  remove(id: number): Promise<void>;
}
