import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EpisodeRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  season_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  number: number;

  @ApiPropertyOptional({ example: 'To You, in 2000 Years', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'The story of humanity behind the walls...' })
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiPropertyOptional({ example: '2013-04-07' })
  @IsDateString()
  @IsOptional()
  aired_at?: string;

  @ApiPropertyOptional({ example: 1440 })
  @IsInt()
  @IsOptional()
  duration_sec?: number;
}
