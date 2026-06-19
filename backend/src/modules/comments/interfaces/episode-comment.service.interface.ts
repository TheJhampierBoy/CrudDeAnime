import { EpisodeCommentRequestDto } from '../dto/episode-comment-request.dto';
import { EpisodeCommentResponseDto } from '../dto/episode-comment-response.dto';

export interface IEpisodeCommentService {
  findAll(): Promise<EpisodeCommentResponseDto[]>;
  findById(id: number): Promise<EpisodeCommentResponseDto>;
  findByEpisodeId(episodeId: number): Promise<EpisodeCommentResponseDto[]>;
  create(dto: EpisodeCommentRequestDto): Promise<EpisodeCommentResponseDto>;
  update(id: number, body: string): Promise<EpisodeCommentResponseDto>;
  remove(id: number): Promise<void>;
}
