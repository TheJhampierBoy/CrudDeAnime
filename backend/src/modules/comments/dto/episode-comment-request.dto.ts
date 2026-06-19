import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EpisodeCommentRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  episode_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 'Amazing episode!' })
  @IsString()
  @IsNotEmpty()
  body: string;
}
