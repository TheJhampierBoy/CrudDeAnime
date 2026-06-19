import { AnimeCommentRequestDto } from '../dto/anime-comment-request.dto';
import { AnimeCommentResponseDto } from '../dto/anime-comment-response.dto';

export interface IAnimeCommentService {
  findAll(): Promise<AnimeCommentResponseDto[]>;
  findById(id: number): Promise<AnimeCommentResponseDto>;
  findByAnimeId(animeId: number): Promise<AnimeCommentResponseDto[]>;
  create(dto: AnimeCommentRequestDto): Promise<AnimeCommentResponseDto>;
  update(id: number, body: string): Promise<AnimeCommentResponseDto>;
  remove(id: number): Promise<void>;
}
