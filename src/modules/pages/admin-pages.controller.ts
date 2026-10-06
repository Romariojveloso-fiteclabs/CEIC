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
import { CreatePageDto } from './dto/create-page.dto.js';
import { UpdatePageDto } from './dto/update-page.dto.js';
import { PagesService } from './pages.service.js';

@ApiTags('pages')
@Controller('v1/admin/pages')
export class AdminPagesController {
  constructor(private readonly service: PagesService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('page:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar páginas institucionais administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('page:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar página por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('page:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar nova página institucional' })
  create(@Body() input: CreatePageDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('page:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar página institucional' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdatePageDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('page:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar página institucional' })
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('page:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar página institucional' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('page:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar página institucional' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('page:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover página institucional (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }
}
