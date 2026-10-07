import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/permissions.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { ApiStandardErrors } from '../../common/decorators/api-standard-errors.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { CoursesService } from './courses.service.js';
import { CourseResponseDto } from './dto/course-response.dto.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@ApiTags('courses')
@ApiStandardErrors(400, 401, 403, 500)
@Controller('v1/admin/courses')
export class AdminCoursesController {
  constructor(@Inject(CoursesService) private readonly courses: CoursesService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('course:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar cursos administrativamente com filtros e paginação' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.courses.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('course:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar curso por ID' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiStandardErrors(404)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.courses.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('course:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar novo curso como rascunho' })
  @ApiResponse({ status: 201, type: CourseResponseDto })
  @ApiStandardErrors(409)
  create(@Body() input: CreateCourseDto, @CurrentUser() user?: AuthUser) {
    return this.courses.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('course:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar curso existente' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiStandardErrors(404, 409)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateCourseDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.courses.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('course:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar curso' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiStandardErrors(404)
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.courses.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('course:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar curso' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiStandardErrors(404)
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.courses.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('course:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar curso arquivado ou excluído' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiStandardErrors(404)
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.courses.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('course:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover curso (soft delete)' })
  @ApiResponse({ status: 204 })
  @ApiStandardErrors(404)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.courses.remove(id, user);
  }
}
