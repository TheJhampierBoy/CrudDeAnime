import { ApiProperty } from '@nestjs/swagger';

export class GenreResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Action' })
  name: string;
}
