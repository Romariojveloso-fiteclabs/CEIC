import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { NewsService } from './news.service.js';

@ApiTags('news')
@Controller('v1/news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar notícias publicadas' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar notícia publicada por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
