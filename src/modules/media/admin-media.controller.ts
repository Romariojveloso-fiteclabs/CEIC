import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/permissions.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { MediaService } from './media.service.js';

@ApiTags('media')
@Controller('v1/admin/media')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiCookieAuth()
  @RequirePermission('media:upload')
  @ApiBearerAuth('bearer')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fazer upload de arquivo de mídia' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        alt: { type: 'string' },
      },
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.mediaService.upload(file, alt, user?.id);
  }

  @Get()
  @ApiCookieAuth()
  @RequirePermission('media:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar arquivos de mídia' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @RequirePermission('media:delete')
  @ApiBearerAuth('bearer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover arquivo de mídia (soft delete)' })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user?: AuthUser,
  ) {
    await this.mediaService.remove(id, user?.id);
  }
}
