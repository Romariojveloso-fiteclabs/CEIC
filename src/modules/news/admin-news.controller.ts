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
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';
import { NewsService } from './news.service.js';

@ApiTags('news')
@Controller('v1/admin/news')
export class AdminNewsController {
  constructor(private readonly service: NewsService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('news:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar notícias administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('news:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar notícia por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('news:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar nova notícia como rascunho' })
  create(@Body() input: CreateNewsDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('news:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar notícia' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateNewsDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('news:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar notícia' })
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('news:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar notícia' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('news:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar notícia' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('news:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover notícia (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }

  @Post(':id/people')
  @ApiCookieAuth()
  @RequirePermission('news:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Vincular pessoa/autor à notícia' })
  addPerson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('personId', new ParseUUIDPipe()) personId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.addPerson(id, personId, user);
  }

  @Delete(':id/people/:personId')
  @ApiCookieAuth()
  @RequirePermission('news:update')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover vínculo de pessoa da notícia' })
  async removePerson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('personId', new ParseUUIDPipe()) personId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.service.removePerson(id, personId, user);
  }
}
