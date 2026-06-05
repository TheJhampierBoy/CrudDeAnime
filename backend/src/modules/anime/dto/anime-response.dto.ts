import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnimeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Attack on Titan' })
  title: string;

  @ApiPropertyOptional({ example: 'Humanity fights giant humanoids...' })
  synopsis: string;

  @ApiProperty({ example: 'finished' })
  status: string;

  @ApiPropertyOptional({ example: 2013 })
  year: number;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  cover_url: string;

  @ApiProperty({ example: 9.12345 })
  avg_score: number;

  @ApiProperty({ example: 42 })
  ratings_count: number;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  updated_at: Date;

  @ApiProperty({ example: [{ id: 1, name: 'Action' }] })
  genres: { id: number; name: string }[];
}
