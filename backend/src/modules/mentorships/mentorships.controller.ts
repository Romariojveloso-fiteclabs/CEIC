import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { MentorshipsService } from './mentorships.service.js';

@ApiTags('mentorships')
@Controller('v1/mentorships')
export class MentorshipsController {
  constructor(private readonly service: MentorshipsService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar mentorias publicadas' })
  findAll() {
    return this.service.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar mentoria publicada por slug' })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
