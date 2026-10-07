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
import { CreatePartnerDto } from './dto/create-partner.dto.js';
import { UpdatePartnerDto } from './dto/update-partner.dto.js';
import { PartnersService } from './partners.service.js';

@ApiTags('partners')
@Controller('v1/admin/partners')
export class AdminPartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('partner:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar parceiros administrativamente' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAllAdmin(query);
  }

  @Get(':id')
  @ApiCookieAuth()
  @RequirePermission('partner:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Buscar parceiro por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @ApiCookieAuth()
  @RequirePermission('partner:create')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Criar novo parceiro' })
  create(@Body() input: CreatePartnerDto, @CurrentUser() user?: AuthUser) {
    return this.service.create(input, user);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @RequirePermission('partner:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar parceiro' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdatePartnerDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.service.update(id, input, user);
  }

  @Patch(':id/publish')
  @ApiCookieAuth()
  @RequirePermission('partner:publish')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Publicar parceiro' })
  publish(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.publish(id, user);
  }

  @Patch(':id/archive')
  @ApiCookieAuth()
  @RequirePermission('partner:archive')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Arquivar parceiro' })
  archive(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.archive(id, user);
  }

  @Patch(':id/restore')
  @ApiCookieAuth()
  @RequirePermission('partner:restore')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Restaurar parceiro' })
  restore(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    return this.service.restore(id, user);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('partner:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover parceiro (soft delete)' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() user?: AuthUser) {
    await this.service.remove(id, user);
  }
}
