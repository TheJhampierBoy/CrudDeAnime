import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SeasonRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  anime_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  number: number;

  @ApiPropertyOptional({ example: 'The Beginning', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 2013 })
  @IsInt()
  @IsOptional()
  year?: number;
}
