import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { PartnersService } from './partners.service.js';

@ApiTags('partners')
@Controller('v1/partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar parceiros publicados' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar parceiro publicado por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
