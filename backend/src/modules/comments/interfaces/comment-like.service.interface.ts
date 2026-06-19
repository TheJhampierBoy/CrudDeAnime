import { CommentLikeRequestDto } from '../dto/comment-like-request.dto';

export interface ICommentLikeService {
  toggle(dto: CommentLikeRequestDto): Promise<{ liked: boolean }>;
}
