import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { PeopleService } from './people.service.js';

@ApiTags('people')
@Controller('v1/people')
export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar pessoas/docentes publicados' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar pessoa/docente por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
