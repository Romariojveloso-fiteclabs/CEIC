import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/permissions.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator.js';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto.js';
import { SiteSettingsService } from './site-settings.service.js';

@ApiTags('site-settings')
@Controller('v1/admin/site-settings')
export class AdminSiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('siteSettings:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Obter configurações do site administrativamente' })
  get() {
    return this.service.get();
  }

  @Patch()
  @ApiCookieAuth()
  @RequirePermission('siteSettings:update')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Atualizar configurações do site' })
  update(@Body() input: UpdateSiteSettingsDto, @CurrentUser() user?: AuthUser) {
    return this.service.update(input, user);
  }
}
