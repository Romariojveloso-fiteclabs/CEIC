import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { DisciplinesService } from './disciplines.service.js';

@ApiTags('disciplines')
@Controller('v1/disciplines')
export class DisciplinesController {
  constructor(private readonly service: DisciplinesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar disciplinas publicadas' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar disciplina publicada por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
