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
import { DisciplinesService } from './disciplines.service.js';
import { CreateDisciplineDto } from './dto/create-discipline.dto.js';
import { UpdateDisciplineDto } from './dto/update-discipline.dto.js';

@ApiTags('disciplines')
@Controller('v1/admin/disciplines')
export class AdminDisciplinesController {
  constructor(private readonly service: DisciplinesService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('discipline:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar disciplinas administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('discipline:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar disciplina por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('discipline:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar nova disciplina' })
  create(@Body() input: CreateDisciplineDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('discipline:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar disciplina' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateDisciplineDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('discipline:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar disciplina' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('discipline:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar disciplina' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('discipline:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover disciplina (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }
}
