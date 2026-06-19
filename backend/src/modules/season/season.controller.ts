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

import { SeasonRequestDto } from './dto/season-request.dto';
import { SeasonResponseDto } from './dto/season-response.dto';
import { SeasonService } from './season.service';

@ApiTags('seasons')
@Controller('seasons')
@UseInterceptors(ClassSerializerInterceptor)
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all seasons' })
  findAll(): Promise<SeasonResponseDto[]> {
    return this.seasonService.findAll();
  }

  @Get('anime/:animeId')
  @ApiOperation({ summary: 'Get all seasons for a given anime' })
  findByAnimeId(
    @Param('animeId', ParseIntPipe) animeId: number,
  ): Promise<SeasonResponseDto[]> {
    return this.seasonService.findByAnimeId(animeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a season by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<SeasonResponseDto> {
    return this.seasonService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new season' })
  create(@Body() dto: SeasonRequestDto): Promise<SeasonResponseDto> {
    return this.seasonService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a season by id' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SeasonRequestDto,
  ): Promise<SeasonResponseDto> {
    return this.seasonService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a season by id' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.seasonService.remove(id);
  }
}
