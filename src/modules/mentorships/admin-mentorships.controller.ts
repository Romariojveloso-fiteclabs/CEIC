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
import { CreateMentorshipScheduleDto } from './dto/create-mentorship-schedule.dto.js';
import { CreateMentorshipDto } from './dto/create-mentorship.dto.js';
import { UpdateMentorshipDto } from './dto/update-mentorship.dto.js';
import { MentorshipsService } from './mentorships.service.js';

@ApiTags('mentorships')
@Controller('v1/admin/mentorships')
export class AdminMentorshipsController {
  constructor(private readonly service: MentorshipsService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('mentorship:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar mentorias administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('mentorship:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar mentoria por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('mentorship:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar nova mentoria' })
  create(@Body() input: CreateMentorshipDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('mentorship:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar mentoria' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateMentorshipDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('mentorship:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar mentoria' })
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('mentorship:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar mentoria' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('mentorship:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar mentoria' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('mentorship:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover mentoria (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }

  @Post(':id/schedules')
  @ApiCookieAuth()
  @RequirePermission('mentorship:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Adicionar sessão de cronograma à mentoria' })
  addSchedule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: CreateMentorshipScheduleDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.addScheduleEntry(id, input, user);
  }

  @Delete('schedules/:scheduleId')
  @ApiCookieAuth()
  @RequirePermission('mentorship:update')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover sessão de cronograma' })
  async removeSchedule(
    @Param('scheduleId', new ParseUUIDPipe()) id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.service.removeScheduleEntry(id, user);
  }
}
