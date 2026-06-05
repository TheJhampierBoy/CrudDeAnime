import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  name: string;

  @ApiProperty({ example: '2026-06-05T00:00:00.000Z' })
  created_at: Date;
}
