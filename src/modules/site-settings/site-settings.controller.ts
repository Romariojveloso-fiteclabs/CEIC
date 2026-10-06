import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SiteSettingsService } from './site-settings.service.js';

@ApiTags('site-settings')
@Controller('v1/site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Obter configurações públicas do site' })
  get() {
    return this.service.get();
  }
}
