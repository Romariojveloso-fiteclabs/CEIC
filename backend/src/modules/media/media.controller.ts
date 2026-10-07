import { createReadStream } from 'node:fs';
import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import { MediaService } from './media.service.js';

@ApiTags('media')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Obter ou baixar arquivo de mídia público' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const { record, filePath } = await this.mediaService.findOne(id);
    res.setHeader('Content-Type', record.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(record.originalFilename)}"`);
    createReadStream(filePath).pipe(res);
  }
}
