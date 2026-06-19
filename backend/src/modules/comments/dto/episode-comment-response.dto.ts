import { ApiProperty } from '@nestjs/swagger';

export class EpisodeCommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  episode_id: number;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 'Amazing episode!' })
  body: string;

  @ApiProperty({ example: 0 })
  likes_count: number;

  @ApiProperty({ example: '2026-06-19T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-06-19T00:00:00.000Z' })
  updated_at: Date;
}
