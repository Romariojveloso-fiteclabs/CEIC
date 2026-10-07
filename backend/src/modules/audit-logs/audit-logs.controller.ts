import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/permissions.js';
import { AuditLogsQueryDto } from './dto/audit-logs-query.dto.js';
import { AuditLogsService } from './audit-logs.service.js';

@ApiTags('audit')
@Controller('v1/admin/audit-logs')
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Get()
  @ApiCookieAuth()
  @RequirePermission('audit:read')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Listar registros de auditoria' })
  findAll(@Query() query: AuditLogsQueryDto) {
    return this.service.findAll(query);
  }
}
