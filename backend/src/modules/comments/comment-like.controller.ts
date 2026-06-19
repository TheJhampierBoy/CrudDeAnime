import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentLikeRequestDto } from './dto/comment-like-request.dto';
import { CommentLikeService } from './comment-like.service';

@ApiTags('comment-likes')
@Controller('comment-likes')
export class CommentLikeController {
  constructor(private readonly service: CommentLikeService) {}

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle a like on a comment (like/unlike)' })
  toggle(
    @Body() dto: CommentLikeRequestDto,
  ): Promise<{ liked: boolean }> {
    return this.service.toggle(dto);
  }
}
