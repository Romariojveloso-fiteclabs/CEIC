import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RequirePermission } from '../../auth/permissions.js';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { PublishCourseDto } from './dto/publish-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.courses.findPublished();
  }

  @Get(':slug')
  @AllowAnonymous()
  findOne(@Param('slug') slug: string) {
    return this.courses.findPublishedBySlug(slug);
  }

  @Post()
  @RequirePermission('content:create')
  create(@Body() input: CreateCourseDto) {
    return this.courses.create(input);
  }

  @Patch(':id')
  @RequirePermission('content:update')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() input: UpdateCourseDto) {
    return this.courses.update(id, input);
  }

  @Patch(':id/publish')
  @RequirePermission('content:publish')
  publish(@Param('id', new ParseUUIDPipe()) id: string, @Body() input: PublishCourseDto) {
    return this.courses.publish(id, input.published);
  }

  @Delete(':id')
  @RequirePermission('content:delete')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.courses.remove(id);
  }
}
