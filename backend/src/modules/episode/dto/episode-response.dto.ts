import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EpisodeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  season_id: number;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiPropertyOptional({ example: 'To You, in 2000 Years' })
  title: string | null;

  @ApiPropertyOptional({ example: 'The story of humanity behind the walls...' })
  synopsis: string | null;

  @ApiPropertyOptional({ example: '2013-04-07' })
  aired_at: string | null;

  @ApiPropertyOptional({ example: 1440 })
  duration_sec: number | null;

  @ApiProperty({ example: 9.12345 })
  avg_score: number;

  @ApiProperty({ example: 42 })
  ratings_count: number;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  created_at: Date;
}
