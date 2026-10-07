import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { CohortsService } from './cohorts.service.js';

@ApiTags('cohorts')
@Controller('v1/cohorts')
export class CohortsController {
  constructor(private readonly service: CohortsService) {}

  @Get(['course/:courseId', 'courses/:courseId'])
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar turmas publicadas de um curso' })
  findByCourse(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.service.findPublishedByCourse(courseId);
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar detalhes de turma publicada por ID' })
  @ApiStandardErrors(404)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findPublishedById(id);
  }
}
