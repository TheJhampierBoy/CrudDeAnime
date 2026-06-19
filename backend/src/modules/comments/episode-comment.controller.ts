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

import { EpisodeCommentRequestDto } from './dto/episode-comment-request.dto';
import { EpisodeCommentResponseDto } from './dto/episode-comment-response.dto';
import { EpisodeCommentService } from './episode-comment.service';

@ApiTags('episode-comments')
@Controller('episode-comments')
@UseInterceptors(ClassSerializerInterceptor)
export class EpisodeCommentController {
  constructor(private readonly service: EpisodeCommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all episode comments' })
  findAll(): Promise<EpisodeCommentResponseDto[]> {
    return this.service.findAll();
  }

  // Declared BEFORE /:id to avoid route collision
  @Get('episode/:episodeId')
  @ApiOperation({ summary: 'Get all comments for a given episode' })
  findByEpisodeId(
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ): Promise<EpisodeCommentResponseDto[]> {
    return this.service.findByEpisodeId(episodeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an episode comment by id' })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EpisodeCommentResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new episode comment' })
  create(
    @Body() dto: EpisodeCommentRequestDto,
  ): Promise<EpisodeCommentResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an episode comment body' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('body') body: string,
  ): Promise<EpisodeCommentResponseDto> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an episode comment' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
