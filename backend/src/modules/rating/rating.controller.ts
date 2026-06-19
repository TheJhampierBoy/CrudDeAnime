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

import { RatingRequestDto } from './dto/rating-request.dto';
import { RatingResponseDto } from './dto/rating-response.dto';
import { RatingService } from './rating.service';

@ApiTags('ratings')
@Controller('ratings')
@UseInterceptors(ClassSerializerInterceptor)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  findAll(): Promise<RatingResponseDto[]> {
    return this.ratingService.findAll();
  }

  // Declared BEFORE /:id to avoid route collision
  @Get('episode/:episodeId')
  @ApiOperation({ summary: 'Get all ratings for a given episode' })
  findByEpisodeId(
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ): Promise<RatingResponseDto[]> {
    return this.ratingService.findByEpisodeId(episodeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<RatingResponseDto> {
    return this.ratingService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new rating' })
  create(@Body() dto: RatingRequestDto): Promise<RatingResponseDto> {
    return this.ratingService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rating by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RatingRequestDto,
  ): Promise<RatingResponseDto> {
    return this.ratingService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rating by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ratingService.remove(id);
  }
}
