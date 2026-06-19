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

import { EpisodeRequestDto } from './dto/episode-request.dto';
import { EpisodeResponseDto } from './dto/episode-response.dto';
import { EpisodeService } from './episode.service';

@ApiTags('episodes')
@Controller('episodes')
@UseInterceptors(ClassSerializerInterceptor)
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all episodes' })
  findAll(): Promise<EpisodeResponseDto[]> {
    return this.episodeService.findAll();
  }

  // Declared BEFORE /:id to avoid route collision
  @Get('season/:seasonId')
  @ApiOperation({ summary: 'Get all episodes for a given season' })
  findBySeasonId(
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ): Promise<EpisodeResponseDto[]> {
    return this.episodeService.findBySeasonId(seasonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an episode by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<EpisodeResponseDto> {
    return this.episodeService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new episode' })
  create(@Body() dto: EpisodeRequestDto): Promise<EpisodeResponseDto> {
    return this.episodeService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an episode by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EpisodeRequestDto,
  ): Promise<EpisodeResponseDto> {
    return this.episodeService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an episode by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.episodeService.remove(id);
  }
}
