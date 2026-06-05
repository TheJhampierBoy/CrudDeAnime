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

import { AnimeRequestDto } from './dto/anime-request.dto';
import { AnimeResponseDto } from './dto/anime-response.dto';
import { AnimeService } from './anime.service';

@ApiTags('animes')
@Controller('animes')
@UseInterceptors(ClassSerializerInterceptor)
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all animes' })
  findAll(): Promise<AnimeResponseDto[]> {
    return this.animeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an anime by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<AnimeResponseDto> {
    return this.animeService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new anime' })
  create(@Body() dto: AnimeRequestDto): Promise<AnimeResponseDto> {
    return this.animeService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an anime by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AnimeRequestDto,
  ): Promise<AnimeResponseDto> {
    return this.animeService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an anime by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.animeService.remove(id);
  }
}
