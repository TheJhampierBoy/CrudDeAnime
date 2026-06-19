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

import { AnimeCommentRequestDto } from './dto/anime-comment-request.dto';
import { AnimeCommentResponseDto } from './dto/anime-comment-response.dto';
import { AnimeCommentService } from './anime-comment.service';

@ApiTags('anime-comments')
@Controller('anime-comments')
@UseInterceptors(ClassSerializerInterceptor)
export class AnimeCommentController {
  constructor(private readonly service: AnimeCommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all anime comments' })
  findAll(): Promise<AnimeCommentResponseDto[]> {
    return this.service.findAll();
  }

  // Declared BEFORE /:id to avoid route collision
  @Get('anime/:animeId')
  @ApiOperation({ summary: 'Get all comments for a given anime' })
  findByAnimeId(
    @Param('animeId', ParseIntPipe) animeId: number,
  ): Promise<AnimeCommentResponseDto[]> {
    return this.service.findByAnimeId(animeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an anime comment by id' })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnimeCommentResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new anime comment' })
  create(
    @Body() dto: AnimeCommentRequestDto,
  ): Promise<AnimeCommentResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an anime comment body' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('body') body: string,
  ): Promise<AnimeCommentResponseDto> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an anime comment' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
