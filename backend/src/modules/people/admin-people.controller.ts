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
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { PeopleService } from './people.service.js';

@ApiTags('people')
@Controller('v1/admin/people')
export class AdminPeopleController {
  constructor(private readonly service: PeopleService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('people:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar pessoas/docentes administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('people:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar pessoa/docente por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('people:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Cadastrar nova pessoa/docente' })
  create(@Body() input: CreatePersonDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('people:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar dados de pessoa/docente' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdatePersonDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('people:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar pessoa/docente' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('people:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar pessoa/docente arquivada' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('people:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover pessoa/docente (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }
}
