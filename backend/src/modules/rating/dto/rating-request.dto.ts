import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class RatingRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  episode_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 8.5, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score_story: number;

  @ApiProperty({ example: 9.0, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score_animation: number;

  @ApiProperty({ example: 7.5, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score_music: number;

  @ApiProperty({ example: 8.0, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score_characters: number;
}
