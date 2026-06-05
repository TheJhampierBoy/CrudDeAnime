import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GenreRequestDto } from './dto/genre-request.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { GenreService } from './genre.service';

@ApiTags('genres')
@Controller('genres')
@UseInterceptors(ClassSerializerInterceptor)
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  findAll(): Promise<GenreResponseDto[]> {
    return this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<GenreResponseDto> {
    return this.genreService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  create(@Body() dto: GenreRequestDto): Promise<GenreResponseDto> {
    return this.genreService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a genre by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GenreRequestDto,
  ): Promise<GenreResponseDto> {
    return this.genreService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a genre by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.genreService.remove(id);
  }
}
