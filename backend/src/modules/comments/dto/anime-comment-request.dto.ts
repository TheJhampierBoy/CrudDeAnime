import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AnimeCommentRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  anime_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 'Great anime!' })
  @IsString()
  @IsNotEmpty()
  body: string;
}
