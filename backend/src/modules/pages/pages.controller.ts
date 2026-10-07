import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { PagesService } from './pages.service.js';

@ApiTags('pages')
@Controller('v1/pages')
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar páginas institucionais publicadas' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar página publicada por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
