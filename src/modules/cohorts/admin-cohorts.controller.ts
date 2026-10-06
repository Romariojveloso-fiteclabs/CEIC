import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/permissions.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { CohortsService } from './cohorts.service.js';
import { AddCohortDisciplineDto } from './dto/add-cohort-discipline.dto.js';
import { AddDisciplinePersonDto } from './dto/add-discipline-person.dto.js';
import { CreateCohortDto } from './dto/create-cohort.dto.js';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto.js';
import { UpdateCohortDto } from './dto/update-cohort.dto.js';

@ApiTags('cohorts')
@Controller('v1/admin/cohorts')
export class AdminCohortsController {
  constructor(private readonly service: CohortsService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('cohort:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar turmas administrativamente' })
  findAll(@Query() query: PaginationQueryDto, @Query('courseId') courseId?: string) {
    return this.service.findAllAdmin({ ...query, courseId });
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('cohort:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar turma por ID com disciplinas associadas' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('cohort:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar nova turma' })
  create(@Body() input: CreateCohortDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar dados de uma turma' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateCohortDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('cohort:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar turma' })
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('cohort:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar turma' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('cohort:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar turma' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('cohort:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover turma (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }

  @Post(':id/disciplines')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Vincular disciplina à turma' })
  addDiscipline(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: AddCohortDisciplineDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.addDiscipline(id, input, user);
  }

  @Delete('disciplines/:cohortDisciplineId')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover disciplina da turma' })
  async removeDiscipline(
    @Param('cohortDisciplineId', new ParseUUIDPipe()) id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.service.removeDiscipline(id, user);
  }

  @Post('disciplines/:cohortDisciplineId/people')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Vincular docente/preceptor à disciplina da turma' })
  addDisciplinePerson(
    @Param('cohortDisciplineId', new ParseUUIDPipe()) id: string,
    @Body() input: AddDisciplinePersonDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.addDisciplinePerson(id, input, user);
  }

  @Delete('disciplines/people/:cohortDisciplinePersonId')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover vínculo de docente da disciplina' })
  async removeDisciplinePerson(
    @Param('cohortDisciplinePersonId', new ParseUUIDPipe()) id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.service.removeDisciplinePerson(id, user);
  }

  @Post('disciplines/:cohortDisciplineId/schedules')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Adicionar entrada de cronograma' })
  addSchedule(
    @Param('cohortDisciplineId', new ParseUUIDPipe()) id: string,
    @Body() input: CreateScheduleEntryDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.addScheduleEntry(id, input, user);
  }

  @Delete('disciplines/schedules/:scheduleEntryId')
  @ApiCookieAuth()
  @RequirePermission('cohort:update')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover entrada de cronograma' })
  async removeSchedule(
    @Param('scheduleEntryId', new ParseUUIDPipe()) id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.service.removeScheduleEntry(id, user);
  }
}
