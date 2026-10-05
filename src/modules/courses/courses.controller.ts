import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RequirePermission } from '../../auth/permissions.js';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { CoursesService } from './courses.service.js';
import { CourseResponseDto } from './dto/course-response.dto.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { PublishCourseDto } from './dto/publish-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@ApiTags('courses')
@ApiStandardErrors(400, 401, 403, 500)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

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

  @Post()
  @ApiCookieAuth()
  @RequirePermission('content:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso', type: CourseResponseDto })
  @ApiStandardErrors(409)
  create(@Body() input: CreateCourseDto) {
    return this.courses.create(input);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('content:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar curso existente' })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso', type: CourseResponseDto })
  @ApiStandardErrors(404, 409)
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() input: UpdateCourseDto) {
    return this.courses.update(id, input);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('content:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar ou despublicar curso' })
  @ApiResponse({ status: 200, description: 'Status de publicacao atualizado com sucesso', type: CourseResponseDto })
  @ApiStandardErrors(404)
  publish(@Param('id', new ParseUUIDPipe()) id: string, @Body() input: PublishCourseDto) {
    return this.courses.publish(id, input.published);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('content:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover curso' })
  @ApiResponse({ status: 204, description: 'Curso removido com sucesso' })
  @ApiStandardErrors(404)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.courses.remove(id);
  }
}
