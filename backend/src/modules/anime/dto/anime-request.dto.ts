import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AnimeRequestDto {
  @ApiProperty({ example: 'Attack on Titan', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Humanity fights giant humanoids...' })
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiProperty({
    example: 'finished',
    enum: ['airing', 'finished', 'upcoming', 'cancelled', 'hiatus'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['airing', 'finished', 'upcoming', 'cancelled', 'hiatus'])
  status: string;

  @ApiPropertyOptional({ example: 2013 })
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  cover_url?: string;

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  genreIds?: number[];
}
