import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SeasonResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  anime_id: number;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiPropertyOptional({ example: 'The Beginning' })
  title: string | null;

  @ApiPropertyOptional({ example: 2013 })
  year: number | null;

  @ApiProperty({ example: 9.12345 })
  avg_score: number;

  @ApiProperty({ example: 42 })
  ratings_count: number;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  created_at: Date;
}
