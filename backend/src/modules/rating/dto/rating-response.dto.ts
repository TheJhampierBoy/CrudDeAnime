import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  episode_id: number;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 8.5 })
  score_story: number;

  @ApiProperty({ example: 9.0 })
  score_animation: number;

  @ApiProperty({ example: 7.5 })
  score_music: number;

  @ApiProperty({ example: 8.0 })
  score_characters: number;

  @ApiProperty({ example: 8.375 })
  final_score: number;

  @ApiProperty({ example: '2026-06-19T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-06-19T00:00:00.000Z' })
  updated_at: Date;
}
