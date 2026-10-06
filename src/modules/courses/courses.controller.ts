import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { CoursesService } from './courses.service.js';
import { CourseResponseDto } from './dto/course-response.dto.js';

@ApiTags('courses')
@Controller('v1/courses')
export class CoursesController {
  constructor(@Inject(CoursesService) private readonly courses: CoursesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Listar cursos publicados' })
  @ApiResponse({ status: 200, description: 'Lista de cursos publicados', type: [CourseResponseDto] })
  findAll() {
    return this.courses.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Buscar curso publicado por slug' })
  @ApiResponse({ status: 200, description: 'Curso retornado com sucesso', type: CourseResponseDto })
  @ApiStandardErrors(404)
  findOne(@Param('slug') slug: string) {
    return this.courses.findPublishedBySlug(slug);
  }
}
