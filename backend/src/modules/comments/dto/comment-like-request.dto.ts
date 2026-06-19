import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CommentLikeRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: 'anime_comment',
    enum: ['anime_comment', 'episode_comment'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['anime_comment', 'episode_comment'])
  target_type: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  target_id: number;
}
